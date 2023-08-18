const { io } = global;

module.exports = (socket) => {
  // join room
  socket.on('room/open', (args) => {
    if (args.prevRoom) {
      socket.leave(args.prevRoom);
    }

    socket.join(args.newRoom);
    io.to(args.newRoom).emit('room/open', args.newRoom);
  });
};
