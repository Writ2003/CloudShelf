import Book from "../models/Book.model.js";
import User from "../models/User.model.js";
import BookContent from "../models/BookContent.model.js";
import redis from "../utils/redisClient.util.js"
import { processPDF } from "../utils/extractPDF.util.js";
import uploadToS3 from "../utils/awsS3Upload.util.js";
import axios from 'axios';

const cardLimits = {
    small: 4,
    medium: 5, 
    large: 6, 
};

export const addNewBook = async(req,res) => {
  try {
    const {title, author, publisher, noOfPages, description, publicationDate, genre} = req.body;
    const coverImage = req.file.path;
    if([title,author,publisher,noOfPages,description,publicationDate,genre].some(field => field.length===0))
      return res.status(400).json({message: 'Fill all the mandatory fields'});
    if(!coverImage) return res.status(400).json({message: 'Fill all the mandatory fields'});
    const book = await Book.findOne({
      $and: {title,author,publisher}
    });
    if(book) return res.status(400).json({message: 'Book is already in database'});
    const newBook = await Book.create({title,author,publisher,noOfPages,description,publicationDate,genre,coverImage});
    if(!newBook) return res.status(400).json({message: "Book coudn't be created"});
    return res.status(200).json({message: "Book added successfully!", newBook});
  } catch (error) {
    console.error('Error while adding a new book, error: ',error);
    res.status(500).json({message: 'Internal server error while adding new book'})
  }
} 

export const getPopularBook = async (req, res) => {
    try {
        const popularBook = await Book.aggregate([
          {
              $addFields: {
                  popularityScore: {
                      $add: [
                          { $multiply: ["$weeklyReaders", 0.7] }, // Assigning a weight
                          { $multiply: ["$rating", 0.3] }
                      ]
                  }
              }
          },
          { $sort: { popularityScore: -1 } },
          { $limit: 1 }
      ]);

        if(!popularBook) return res.status(404).json({success:false, message:"Couldn't find any popular book, something went wrong"});
        return res.status(200).json({success:true, data:popularBook});
    } catch (error) {
      return res.status(500).json({success:false, error: 'Failed to fetch popular books' });
    }
}

export const incrementReadership = async (req, res) => {
    const { bookId } = req.params;
    try {
      const book = await Book.findByIdAndUpdate(
        bookId,
        { $inc: { totalReaders: 1, weeklyReaders: 1 } },
        { new: true } 
      );

      await User.findOneAndUpdate(
        req.user._id,
        { $addToSet: { history : bookId }},
        { new : true }
      );
  
      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }

      return res.status(200).json({ message: 'Readership updated successfully', data: book, success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update readership' });
    }
  }

export const getRecommendation = async (req, res) => {
    const { screenSize } = req.query;
    const userId = req.user._id;
    const limit = cardLimits[screenSize] || cardLimits.medium;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ success: false, message: "No such user found!"});

    const history = user.history.map(id => id.toString());
    try{
        const response = await axios.post("http://127.0.0.1:5050/recommend", { history, limit });
        //if(!response.ok) return res.status(404).json({ success: false, message: "Something went wrong, unable to fetch recommendation data"});
        return res.status(200).json({success: true, data: response.data.recommendations});
    } catch (error) {
        res.status(500).json({ error: "Recommendation service error" });
    }
}

export const getBooks = async (req, res) => {
  const { screenSize } = req.query;
  const limit = cardLimits[screenSize] || cardLimits.medium;

  try {
    const books = await Book.aggregate([
      { $sample: { size: limit } }
    ]);

    if (!books || books.length === 0) {
      return res.status(404).json({ success: false, message: "No books found" });
    }

    return res.status(200).json({ success: true, data: books });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Couldn't connect the books server" });
  }
};


export const getCategories = async (req, res) => {
  try {
    const genres = await Book.aggregate([
      { $unwind: "$genre" },
      {
        $group: {
          _id: "$genre",
          books: { $push: "$$ROOT" },
          totalBooks: { $sum: 1 }
        }
      },
      { $sample: { size: 12 } } // Randomly pick 12 genres
    ]);

    if (!genres || genres.length === 0) {
      return res.status(404).json({ message: "Unable to fetch genres" });
    }

    res.status(200).json({ data: genres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error while fetching genres" });
  }
};


export const getBookInfo = async(req,res) => {
  try {
    const {bookId} = req.params;
    if(!bookId) res.status(404).json({message:"BookId not found!"});
    const book = await Book.findOne({_id:bookId}).select('-reviews');
    if(!book) res.status(404).json({message:"No such book found!"});
    const isFavourite = req.user.favouriteBooks.some(book => String(book._id)===bookId);
    return res.status(200).json({book,isFavourite});
  } catch (error) {
    res.status(500).json({message: "Internal server error while fetching book information"})
  }
}

export const addToFavourite = async(req,res) => {
  const {bookId} = req.params;
  const userId = req.user._id
  try {
    const alreadyFavourite = req.user.favouriteBooks.includes(bookId);

    await User.findByIdAndUpdate(
      userId,
      alreadyFavourite
        ? { $pull: { favouriteBooks: bookId } }
        : { $addToSet: { favouriteBooks: bookId } },
      { new: true }
    );
    return res.status(200).json({message: `Book ${ alreadyFavourite? 'removed from' : 'added to'} favourites`, success: true});
  } catch (error) {
    res.status(500).json({message: "Internal server error while adding to favourite"});
  }
}

export const getBookContent = async(req,res) => {
  const { bookId } = req.params;
  const userId = req.user._id;
  const { offset = 0, limit = 15 } = req.query;
  try {
    const cacheKey = `book:${bookId}:chunk:${offset}-${parseInt(offset) + parseInt(limit)}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('📦 Served from Redis');
      return res.status(200).json(JSON.parse(cached));
    }
    const book = await BookContent.findOne({ bookId });
    const paginatedContent = book.content.slice(offset, offset + limit);
    
    data = {totalPages: book.totalPages, pages: paginatedContent};
    await redis.set(cacheKey, JSON.stringify(data), 'EX', 3600);
    res.status(200).json({
      totalPages: book.totalPages,
      pages: paginatedContent
    });
  } catch (error) {
    res.status(500).json({message: "Internal server error while fetching book content"});
  }
}

export const uploadBookContent = async(req,res) => {
  const { bookId } = req.params;
  const filePath = req.file.path; // multer must be configured
    if (!filePath) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  try {
    console.log('File: ',req?.file);
    // Extract HTML pages from the PDF
    const result = await uploadToS3(req?.file);
    if(!result) return res.status(400).json({message: "Couldn't upload file"});
    await Book.findByIdAndUpdate(bookId, {url: result});
    const htmlPages = await processPDF(filePath);

    if (!htmlPages || htmlPages.length === 0) {
      return res.status(400).json({ message: "No content extracted from PDF" });
    }

    // Format pages for DB
    const contentArray = htmlPages.map((html, index) => ({
      page: index + 1,
      html
    }));

    // Upsert: replace if already exists for this book
    const existing = await BookContent.findOne({ bookId });
    if (existing) {
      await BookContent.updateOne(
        { bookId },
        { $set: { content: contentArray, totalPages: htmlPages.length } }
      );
    } else {
      await BookContent.create({
        bookId,
        totalPages: htmlPages.length,
        content: contentArray
      });
    }

    res.status(200).json({ message: "Book content uploaded successfully", totalPages: htmlPages.length });
  } catch (error) {
    console.error('❌ Error uploading book content:', error);
    res.status(500).json({ message: "Internal server error while uploading book content" });
  }
};

export const removeBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error while deleting book' });
  }
};