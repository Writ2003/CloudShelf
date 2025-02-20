import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import './src/cron/resetWeeklyReaders.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
import bookRoutes from "./src/routes/Book.routes.js"
import userRoutes from "./src/routes/User.routes.js"

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Stack Backend!');
});

app.use("/api/book",bookRoutes);
app.use("/api/user", userRoutes);

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
