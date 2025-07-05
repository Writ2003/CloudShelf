export default function initCoupleSocket(io) {
  io.on('connection', (socket) => {
    console.log(`🧑‍🤝‍🧑 Couple connected: ${socket.id}`);

    // Join a couple room based on book + coupleId
    socket.on('join_couple_room', ({ coupleId, bookId }) => {
      const roomId = `couple_${bookId}_${coupleId}`;
      socket.join(roomId);
      socket.roomId = roomId;

      console.log(`User ${socket.id} joined room ${roomId}`);
      io.to(roomId).emit('user_joined', { socketId: socket.id });
    });

    // Page Sync (One user turns page, other follows)
    socket.on('couple_page_change', ({ page }) => {
      if (!socket.roomId) return;
      socket.to(socket.roomId).emit('sync_page_change', { page });
    });

    // WebRTC Signaling
    socket.on('couple_webrtc_offer', (data) => {
      socket.to(socket.roomId).emit('couple_webrtc_offer', data);
    });

    socket.on('couple_webrtc_answer', (data) => {
      socket.to(socket.roomId).emit('couple_webrtc_answer', data);
    });

    socket.on('couple_webrtc_candidate', (data) => {
      socket.to(socket.roomId).emit('couple_webrtc_candidate', data);
    });

    socket.on('disconnect', () => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('user_disconnected', { socketId: socket.id });
        console.log(`User ${socket.id} disconnected from ${socket.roomId}`);
      }
    });
  });
}
