import LikeComments from '../models/LikeComments.model.js';
import Review from '../models/Review.model.js';

export const toggleLikeState = async(req,res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    try {
        const comment = await Review.findById(commentId);
        if(!comment) return res.status(404).json({message: 'No such comment found!'});

        let likedComment = await LikeComments.findOne({commentId});
        if(!likedComment) likedComment = new LikeComments({
            user: userId,
            commentId
        });
        else {
           const alreadyLiked =  likedComment.likedBy.includes(userId);
           if(alreadyLiked) likedComment.likedBy.pull(userId);
           else likedComment.likedBy.push(userId);
        }
        await likedComment.save();

        res.status(200).json({likedComment, noOfLikes: likedComment?.likedBy?.length, userId});
    } catch (error) {
        console.error('Error while updating like state, error: ',error);
        res.status(500).json({ message: 'Server error while updating like state' });
    }
}