import Topic from "../models/Topic.model.js";
import sanitizeHtml from 'sanitize-html';

const allowedTags = ['b', 'i', 'em', 'strong', 'u', 's', 'p', 'ul', 'ol', 'li', 'br', 'span'];

export const createTopic = async (req, res) => {
  try {
    const { title, description, bookId } = req.body;
    const createdBy = req.user._id;

    const cleanHTML = sanitizeHtml(description, {allowedTags});

    if (cleanHTML.length > 1000) {
      return res.status(400).json({ message: 'Description is too long.' });
    }

    const newTopic = await Topic.create({ title, description:cleanHTML, bookId, createdBy });
    res.status(201).json({newTopic});
  } catch (error) {
    console.error("Error creating topic:", error);
    res.status(500).json({ message: "Failed to create topic" });
  }
};

export const getTopics = async (req, res) => {
  try {
    const { bookId } = req.query;

    const query = bookId ? { bookId } : {};
    let topics = await Topic.find(query).populate("createdBy", "name email").sort({ createdAt: -1 });
    const noOfTopics = topics?.length;
    topics = topics.map(topic => {
      const plain = topic.toObject();  // convert to plain JS object
      return {
        ...plain,
        user: topic.createdBy?.name || topic.createdBy?.email,
      };
    });
    res.status(200).json({topics, noOfTopics});
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