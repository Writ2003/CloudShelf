import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  comment: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
}, {timestamps: true});

const Review = mongoose.model('Review', reviewSchema);
export default Review;