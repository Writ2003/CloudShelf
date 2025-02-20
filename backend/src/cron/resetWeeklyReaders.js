// cron/resetWeeklyReaders.js
import cron from 'node-cron';
import Book from '../models/Book.model.js';

// Schedule a task to reset weekly readers every Monday at midnight
cron.schedule('0 0 * * 1', async () => {
  console.log('Resetting weekly readers...');
  try {
    await Book.updateMany({}, { weeklyReaders: 0 }); // Reset weeklyReaders to 0
    console.log('Weekly readers reset successfully.');
  } catch (error) {
    console.error('Error resetting weekly readers:', error);
  }
});