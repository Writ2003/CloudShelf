import DiscussionMessage from '../models/DiscussionMessage.model.js';
import dayjs from '../utils/dayjs.util.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_topic', ({ topicId, userId, username }) => {
      const room = `topic_${topicId}`;
      socket.join(room);

      socket.to(room).emit("user_joined", { username, userId });
      console.log(`✅ ${username} joined ${room}`);
    });

    socket.on('leave_topic', ({ topicId, userId, username }) => {
      const room = `topic_${topicId}`;
      socket.leave(room);

      socket.to(room).emit("user_left", { username, userId });
      console.log(`🚪 ${username} left ${room}`);
    });

    socket.on("discussion_send_message", async (data) => {
      const { topicId, message, userId } = data;
      const room = `topic_${topicId}`;
      try {
        const currentMessage = await DiscussionMessage.create({
          topicId,
          user: userId,
          text: message,
        });

        const populatedMessage = await currentMessage.populate('user', 'name');

        io.to(room).emit("discussion_receive_message", {
          _id: currentMessage._id,
          user: populatedMessage.user,
          text: currentMessage.text,
          createdAt: currentMessage.createdAt
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
