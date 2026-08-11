export const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    
    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
