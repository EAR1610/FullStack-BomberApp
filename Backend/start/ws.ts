import app from '@adonisjs/core/services/app';
import Ws from '#services/Ws';

app.ready(() => {
  Ws.boot();

  // When a client connects
  const io = Ws.io;
  io?.on('connection', (socket) => {
    const { userId, firefighterId } = socket.handshake.query; // Get the userId and firefighterId from the query string

    if (userId) {
      // If is a user (not a firefighter), join a room based on their userId
      socket.join(`user_${userId}`);
      console.log(`Usuario ${userId} conectado a su sala`);
    }

    if (firefighterId) {
      // If is a firefighter, join a room based on their firefighterId
      socket.join(`firefighter_${firefighterId}`);
      console.log(`Bombero ${firefighterId} conectado a su sala`);
    }

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
});
