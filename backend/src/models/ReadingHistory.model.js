import mongoose from 'mongoose'

const readingHistorySchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    totalPages: Number,
    pagesRead: { 
        type: Number,
        default: 0
    },
    bookmarkedAt: { 
        type: Number,
        default: 0
    },
    coupleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    roomName: String
},{timestamps: true});

export default ReadingHistory = mongoose.model('ReadingHistory',readingHistorySchema);