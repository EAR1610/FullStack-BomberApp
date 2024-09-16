import app from '@adonisjs/core/services/app';
import Ws from '#services/Ws';

app.ready(() => {
  Ws.boot();

  // Cuando un cliente se conecta
  const io = Ws.io;
  io?.on('connection', (socket) => {
    console.log('Client connected: ', socket.id);

    // Podrías gestionar un evento específico aquí, por ejemplo:
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected: ', socket.id);
    });
  });
});
