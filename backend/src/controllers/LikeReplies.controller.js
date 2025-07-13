import LikeReplies from '../models/LikeReplies.model.js';
import Reply from '../models/Reply.model.js';

export const toggleLikeState = async(req,res) => {
    const { replyId } = req.params;
    const userId = req.user._id;
    try {
        const comment = await Reply.findById(replyId);
        if(!comment) return res.status(404).json({message: 'No such comment found!'});

        let likedReply = await LikeReplies.findOne({replyId});
        if(!likedReply) likedReply = new LikeReplies({
            user: userId,
            replyId
        });
        else {
           const alreadyLiked =  likedReply.likedBy.includes(userId);
           if(alreadyLiked) likedReply.likedBy.pull(userId);
           else likedReply.likedBy.push(userId);
        }
        await likedReply.save();

        res.status(200).json({likedReply, noOfLikes: likedReply?.likedBy?.length, userId});
    } catch (error) {
        console.error('Error while updating like state for a reply, error: ',error);
        res.status(500).json({ message: 'Server error while updating like state' });
    }
}