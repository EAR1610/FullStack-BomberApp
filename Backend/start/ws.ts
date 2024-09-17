import app from '@adonisjs/core/services/app';
import Ws from '#services/Ws';

app.ready(() => {
  Ws.boot();

  // When a client connects
  const io = Ws.io;
  io?.on('connection', (socket) => {
    console.log('Client connected: ', socket.id);

    // You could also do something like this:
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected: ', socket.id);
    });
  });
});
