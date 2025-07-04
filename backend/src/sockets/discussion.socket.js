import DiscussionMessage from '../models/DiscussionMessage.model.js';
import dayjs from '../utils/dayjs.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_topic', (topicId) => {
      socket.join(`topic_${topicId}`);
    });

    socket.on('leave_topic', (topicId) => {
      socket.leave(`topic_${topicId}`);
    });

    socket.on("discussion_send_message", async ({ topicId, user, text, parentMessage }) => {
      try {
        const message = await DiscussionMessage.create({
          topicId,
          user,
          text,
          parentMessage: parentMessage || null
        });

        const populatedMessage = await message.populate('user', 'name');

        io.to(`topic_${topicId}`).emit("discussion_receive_message", {
          _id: message._id,
          user: populatedMessage.user,
          text: message.text,
          createdAgo: dayjs(message.createdAt).fromNow()
        });
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from discussion: ', socket.id);
    });
  });
};
