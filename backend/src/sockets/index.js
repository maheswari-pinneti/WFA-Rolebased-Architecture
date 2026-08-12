import { handleAttendanceEvents } from './attendance.socket.js';
import { handleNotificationEvents } from './notification.socket.js';
import { handleEmployeeEvents } from './employee.socket.js';
import { handleDashboardEvents } from './dashboard.socket.js';

export const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    
    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });
    
    // Register domain socket events
    handleAttendanceEvents(socket, io);
    handleNotificationEvents(socket, io);
    handleEmployeeEvents(socket, io);
    handleDashboardEvents(socket, io);
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

