import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import './src/cron/resetWeeklyReaders.js';
import initDiscussionSocket from './src/sockets/discussion.socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const discussionNamespace = io.of("/discussion");
initDiscussionSocket(discussionNamespace);
// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
import bookRoutes from "./src/routes/Book.routes.js"
import userRoutes from "./src/routes/User.routes.js"
import protectedRoutes from "./src/routes/protected.routes.js"
import searchRoutes from "./src/routes/Search.routes.js"
import TextToSpeectRoutes from "./src/routes/TTS.routes.js"
import ReviewRoutes from "./src/routes/Review.routes.js"
import ReplyRoutes from "./src/routes/Reply.routes.js"
import TopicRoutes from "./src/routes/Topic.route.js"
import DiscussionMessagesRoutes from "./src/routes/DiscussionMessages.route.js";
import LikeCommentsRoute from './src/routes/LikeComments.route.js';
import LikeRepliesRoute from './src/routes/LikeReplies.route.js';

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Stack Backend!');
});

app.use("/api/book",bookRoutes);
app.use("/api/user", userRoutes);
app.use('/api/protectedRoute',protectedRoutes);
app.use("/api/search",searchRoutes);
app.use("/api/tts",TextToSpeectRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/reply", ReplyRoutes);
app.use("/api/discussionTopic", TopicRoutes);
app.use("/api/discussionMessages", DiscussionMessagesRoutes);
app.use("/api/likeComment", LikeCommentsRoute);
app.use("/api/likeReply", LikeRepliesRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

/*import { fileURLToPath } from 'url';
import path from 'path';
import csvParser from 'csv-parser';
import fs from 'fs';
import Book from './src/models/Book.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, 'public', 'book_dataset_real_covers.csv');

console.log(csvFilePath);

const importCSV = async () => {
  const books = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      books.push({
        title: row.title,
        author: row.author,
        publisher: row.publisher,
        noOfPages: parseInt(row.noOfPages, 10),
        rating: parseFloat(row.rating),
        description: row.description,
        publicationDate: new Date(row.publicationDate),
        coverImage: row.coverImage,
        genre: row.genre.split(', ').map(g => g.trim()),
        totalReaders: parseInt(row.totalReaders, 10),
        weeklyReaders: parseInt(row.weeklyReaders, 10),
      });
    })
    .on('end', async () => {
      try {
        await Book.insertMany(books);
        console.log('CSV Data Successfully Imported!');
        mongoose.connection.close();
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    });
};

// Run the import function
importCSV();*/