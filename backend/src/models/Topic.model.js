import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Topic', topicSchema);