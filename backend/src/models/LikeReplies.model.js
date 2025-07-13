import mongoose from "mongoose";

const LikeRepliesSchema = new mongoose.Schema({
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const LikeReplies =  mongoose.model('LikeReplies', LikeRepliesSchema);
export default LikeReplies;