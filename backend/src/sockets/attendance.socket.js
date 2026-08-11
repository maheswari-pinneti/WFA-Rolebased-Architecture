export const handleAttendanceEvents = (socket, io) => {
  socket.on('employee-check-in', (data) => {
    io.to(`org-${data.organizationId}`).emit('attendance-update', data);
  });
};
