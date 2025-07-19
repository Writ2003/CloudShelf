export default function initCoupleSocket(io) {
  io.on('connection', (socket) => {
    console.log(`🧑‍🤝‍🧑 Couple connected: ${socket.id}`);

    // Join a couple room based on book + coupleId
    socket.on('join_couple_room', ({ coupleId, bookId }) => {
      const roomId = `couple_${bookId}_${coupleId}`;
      console.log(`room Id: ${roomId}`);
      socket.join(roomId);
      socket.roomId = roomId;

      const roomSize = io.adapter.rooms.get(roomId)?.size || 0;
      console.log(roomSize);
      if (roomSize === 2) {
        io.to(roomId).emit("couple_ready", { message: "Both users connected" });
      } else if (roomSize > 2) {
        socket.leave(roomId);
        socket.emit("room_full", { message: "This couple room already has 2 users." });
      }

      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('couple_send_message', ({ text, coupleId, bookId:bookid }) => {
      if (!socket.roomId) return;
      console.log(text);
      socket.to(socket.roomId).emit('couple_receive_message', { text } );
    })

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
