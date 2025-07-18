import Review from "../models/Review.model.js";
import LikeComments from "../models/LikeComments.model.js";
import Reply from "../models/Reply.model.js";
import Dayjs from "../utils/Dayjs.util.js";

export const addReview = async (req, res) => {
  const { bookId } = req.params;
  const { comment, rating } = req.body;
  const userId = req.user?._id;

  if (!comment && !rating) {
    return res.status(400).json({ message: 'Comment or rating is required.' });
  }

  try {
    // Optional: prevent multiple reviews by same user on same book
    const existing = await Review.findOne({ bookId, user: userId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this book.' });
    }
    let review;
    if(!comment) 
    review = new Review({
      user: userId,
      bookId,
      rating,
    });
    else review = new Review({
      user: userId,
      bookId,
      comment
    });
    await review.save();
    review = (await review.populate('user','username email')).toObject();
    res.status(201).json({ message: 'Review added successfully.', review });
  } catch (err) {
    console.error('[Add Review Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const fetchReview = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user?._id;

  try {
    const review = await Review.findOne({ bookId, user: userId });
    if (!review) {
      return res.status(404).json({ message: 'No review found for this book by the user.' });
    }

    return res.status(200).json({ review });
  } catch (err) {
    console.error('[Fetch Review Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const updateReview = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user?._id;
  const { comment, rating } = req.body;

  if (!comment && typeof rating !== 'number') {
    return res.status(400).json({ message: 'Nothing to update. Provide comment and/or rating.' });
  }

  try {
    const review = await Review.findOne({ bookId, user: userId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found for this book by the user.' });
    }

    // Update fields if provided
    if (comment) review.comment = comment;
    if (typeof rating === 'number') review.rating = rating;

    await review.save();
    review = (await review.populate('user','username email')).toObject();
    res.status(200).json({ message: 'Review updated successfully.', review });
  } catch (err) {
    console.error('[Update Review Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const fetchAllReviews = async (req, res) => {
  const { bookId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.user._id;
  const skip = (page - 1) * limit;

  try {
    const totalReviews = await Review.countDocuments({ bookId });

    const rawReviews = await Review.find({ bookId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);


    const likeDocs = await LikeComments.find({
      commentId: { $in: rawReviews.map((r) => r._id) },
    });

    const likeDocMap = new Map(
      likeDocs.map((doc) => [doc.commentId.toString(), doc])
    );

// === REPLY HANDLING ===
    const replyCounts = await Reply.aggregate([
      {
        $match: {
          reviewId: { $in: rawReviews.map((r) => r._id) }
        }
      },
      {
        $group: {
          _id: '$reviewId',
          count: { $sum: 1 }
        }
      }
    ]);

    const replyCountMap = new Map(
      replyCounts.map(rc => [rc._id.toString(), rc.count])
    );

// === FINAL MAPPING ===
    const reviews = rawReviews.map((review) => {
      const reviewIdStr = review._id.toString();
    
      const likeDoc = likeDocMap.get(reviewIdStr);
      const likedByArray = likeDoc?.likedBy || [];
    
      return {
        _id: review._id,
        user: review.user.username || review.user.email,
        text: review.comment,
        createdAt: Dayjs(review.createdAt).fromNow(),
        updatedAt: Dayjs(review.updatedAt).fromNow(),
        isLiked: likedByArray.includes(userId),
        likeCount: likedByArray.length || 0,
        noOfReplies: replyCountMap.get(reviewIdStr) || 0
      };
    });
    
    res.status(200).json({
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
    });
  } catch (err) {
    console.error('[Fetch Paginated Reviews Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteReview = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user?._id;

  try {
    const review = await Review.findOneAndDelete({ bookId, user: userId });

    if (!review) {
      return res.status(404).json({ message: 'No review found to delete.' });
    }

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (err) {
    console.error('[Delete Review Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};