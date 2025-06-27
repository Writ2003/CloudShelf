import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    page: Number,
    html: {
     type: String,
     required: true
    }
});

const BookContentSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book'
    },
    totalPages: Number,
    content: [contentSchema]
},{timestamps: true})

const BookContent = mongoose.model('BookContent',BookContentSchema);
export default BookContent;