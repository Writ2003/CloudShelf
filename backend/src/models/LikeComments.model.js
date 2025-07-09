import mongoose from "mongoose";

const LikeCommentSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

export default mongoose.model('LikeComments', LikeCommentSchema);