import mongoose from 'mongoose';
import Review from './Review.model.js'; 

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
  noOfPages: {
    type: Number,
    required: true,
    min: 1,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: 0,
  },
  reviews: [Review.schema],
  description: {
    type: String,
    required: true,
    trim: true,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  coverImage: {
    type: String, 
    required: true,
  },
  genre: {
    type: [String], 
    required: true,
  },
  totalReaders: {
    type: Number,
    default: 0, 
  },
  weeklyReaders: {
    type: Number,
    default: 0, 
  },
  url: {
    type: String
  }
}, {
  timestamps: true, 
});

bookSchema.index({
  title: 'text',
  author: 'text',
  publisher: 'text',
});

const Book = mongoose.model('Book', bookSchema);
export default Book;