import mongoose from "mongoose";

const discussionMessageSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: { type: String, required: true, trim: true },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionMessage',
    default: null
  }
}, { timestamps: true });

export default mongoose.model('DiscussionMessage', discussionMessageSchema);
