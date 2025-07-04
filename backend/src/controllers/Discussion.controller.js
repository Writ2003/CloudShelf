import DiscussionMessage from "../models/DiscussionMessage.model.js";
import dayjs from "../utils/Dayjs.util.js";

export const getMessagesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await DiscussionMessage.find({ topicId })
      .populate("user", "name")
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      user: msg.user,
      text: msg.text,
      createdAgo: dayjs(msg.createdAt).fromNow(),
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};