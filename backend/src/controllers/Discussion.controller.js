import DiscussionMessage from "../models/DiscussionMessage.model.js";
import dayjs from "dayjs";

const formatDate = (mongoDate) => {
  return dayjs(mongoDate).format("HH:mm DD/MM/YY");
};

export const getMessagesByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalMessages = await DiscussionMessage.countDocuments({topicId});

    const messages = await DiscussionMessage.find({ topicId })
      .populate("user", "username email")
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      user: msg.user.username || msg.user.email,
      text: msg.text,
      timestamp: formatDate(msg.createdAt),
    }));

    res.status(200).json({messages: formattedMessages, totalMessages});
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};