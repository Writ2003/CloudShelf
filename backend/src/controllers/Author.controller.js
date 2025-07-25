import Author from '../models/Author.model.js';

export const addAuthor = async(req,res) => {
    const {name, authorId} = req.body;
    try {
        if(!name || !authorId) return res.status(404).json({message: 'Both name and authorId fields are mandatory'});
        const isAvailable = await Author.findOne({authorId});
        if(isAvailable) return res.status(404).json({message: 'Author is already added'});
        const author = new Author({name, authorId});
        await author.save();
        res.status(200).json({message: 'Successfully added new author', author});
    } catch (error) {
        console.error('Error while adding author, error: ',error);
        res.status(500).json({message: 'Server error while adding author'});   
    }
};

export const getAuthor = async(req,res) => {
    const { searchQuery } =  req.query;
    try {
        const regex = new RegExp(searchQuery, 'i');
        
        const results = await Author.find({
          $or: [
            { name: { $regex: regex } },
            { authorId: { $regex: regex } },
          ]
        });

        res.status(200).json({authors: results});
    } catch (error) {
        console.error('Error while fetching author, error: ',error);
         res.status(500).json({message: 'Server error while fetching author'});   
    }
}