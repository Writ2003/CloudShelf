import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true});

authorSchema.index({
    name: 'text',
    authorId: 'text'
})

const Author = mongoose.model('Author',authorSchema);
export default Author;