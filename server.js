import http from 'http';
import { Server } from 'socket.io';
import { app } from './backend/src/app.js';
import { initSockets } from './backend/src/sockets/index.js';

const PORT = 5000;

let server;

if (process.env.NODE_ENV !== 'test') {
  server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  initSockets(io);

  server.listen(PORT, () => {
    console.log(`Backend API with Socket.io running on http://localhost:${PORT}`);
  });
} else {
  server = http.createServer(app);
}

export { app, server };
