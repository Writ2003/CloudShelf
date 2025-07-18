import Reply from '../models/Reply.model.js';
import dayjs from '../utils/Dayjs.util.js';
import LikeReplies from '../models/LikeReplies.model.js';

export const addReply = async (req, res) => {
  const { reviewId } = req.params;
  const { text } = req.body;
  const userId = req.user?._id;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Reply text is required.' });
  }

  try {
    const reply = new Reply({
      reviewId,
      user: userId,
      text: text.trim(),
    });

    await reply.save();

    const noOfReplies = await Reply.countDocuments({reviewId});
    reply = (await reply.populate('user','username email')).toObject();
    res.status(201).json({ message: 'Reply added successfully.', reply, noOfReplies });
  } catch (err) {
    console.error('[Add Reply Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const fetchReplies = async (req, res) => {
  const { reviewId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const userId = req?.user?._id;
  const skip = (page - 1) * limit;

  try {
    const totalReplies = await Reply.countDocuments({ reviewId });

    const rawReplies = await Reply.find({ reviewId })
      .populate('user', 'username email') // Optional: show user info
      .sort({ createdAt: 1 }) // oldest first
      .skip(skip)
      .limit(limit);

    const likeDocs = await LikeReplies.find({
      replyId: { $in: rawReplies.map((r) => r._id) },
    });

    const likeDocMap = new Map(
      likeDocs.map((doc) => [doc.replyId.toString(), doc])
    );

    const replies = rawReplies.map(reply => {
      const doc = likeDocMap.get(reply._id.toString());
      const likedBy = doc?.likedBy || [];
      const isLiked = userId ? likedBy.includes(userId.toString()) : false;
      const likeCount = likedBy.length;

      return {
        _id: reply._id,
        reviewId: reply.reviewId,
        user: reply.user.username || reply.user.email,
        text: reply.text,
        isLiked,
        likeCount,
        createdAt: dayjs(reply.createdAt).fromNow(),
        updatedAt: dayjs(reply.updatedAt).fromNow(),
      };
    });

    res.status(200).json({
      replies,
      totalReplies,
      currentPage: page,
      totalPages: Math.ceil(totalReplies / limit),
    });
  } catch (err) {
    console.error('[Fetch Replies Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user._id;

  try {
    const reply = await Reply.findOne({ _id: replyId, user: userId });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found or unauthorized.' });
    }

    await reply.deleteOne();

    res.status(200).json({ message: 'Reply deleted successfully.' });
  } catch (err) {
    console.error('[Delete Reply Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateReply = async (req, res) => {
  const { replyId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Reply text cannot be empty.' });
  }

  try {
    const reply = await Reply.findOne({ _id: replyId, user: userId });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found or unauthorized.' });
    }

    reply.text = text.trim();
    await reply.save();
    reply = (await reply.populate('user','username email')).toObject();
    res.status(200).json({ message: 'Reply updated successfully.', reply });
  } catch (err) {
    console.error('[Update Reply Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


