import Topic from "../models/Topic.model.js";

export const createTopic = async (req, res) => {
  try {
    const { title, description, bookId } = req.body;
    const createdBy = req.user._id;

    const newTopic = await Topic.create({ title, description, bookId, createdBy });
    res.status(201).json(newTopic);
  } catch (error) {
    console.error("Error creating topic:", error);
    res.status(500).json({ message: "Failed to create topic" });
  }
};

export const getTopics = async (req, res) => {
  try {
    const { bookId } = req.query;

    const query = bookId ? { bookId } : {};
    const topics = await Topic.find(query).populate("createdBy", "name").sort({ createdAt: -1 });

    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Failed to fetch topics" });
  }
};

export const getTopicById = async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId).populate("createdBy", "name");

    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.status(200).json(topic);
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ message: "Failed to fetch topic" });
  }
};