import Book from "../models/Book.model.js";
import User from "../models/User.model.js";

const cardLimits = {
    medium: 5, 
    large: 6, 
};

export const getPopularBook = async (req, res) => {
    try {
        const popularBook = await Book.find()
        .sort({ weeklyReaders: -1 }) 
        .limit(1); 

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
  
      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }
  
      return res.status(200).json({ message: 'Readership updated successfully', data: book, success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update readership' });
    }
  }

export const getRecommendation = async (req, res) => {
    const { screenSize, userId } = req.params;
    const limit = cardLimits[screenSize] || cardLimits.medium;
    
    const user = await User.findOne({ userId });

    if(!user) return res.status(404).json({ success: false, message: "No such user found!"});

    const history = user ? user.history : [];

    try {
        const response = await axios.post("http://127.0.0.1:5001/recommend", { history, limit });
        //if(!response.ok) return res.status(404).json({ success: false, message: "Something went wrong, unable to fetch recommendation data"});
        return res.status(200).json({success: true, data: response.data});
    } catch (error) {
        res.status(500).json({ error: "Recommendation service error" });
    }
}