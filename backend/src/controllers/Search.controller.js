import Book from "../models/Book.model.js";

export const searchBook = async(req,res) => {
    const {searchQuery} = req.query;
    console.log('Search Query: ',searchQuery);
    try {
        const regex = new RegExp(searchQuery, 'i');

        const results = await Book.find({
          $or: [
            { title: { $regex: regex } },
            { author: { $regex: regex } },
            { publisher: { $regex: regex } },
          ]
        }).limit(15).sort('title');
        console.log(results)
        return res.status(200).json({success:true, data:results});

    } catch (error) {
        return res.status(500).json({success:false, error: 'Failed to fetch seached book' });
    }
}