const server = require('http').createServer();
const io = require('socket.io')(server);
const uuid = require('uuid');
const Player = require('./players');
const Room = require('./rooms');

const rooms = {};

io.on('connection', (socket) => {
  const player = new Player(socket);
  console.log('connected');
  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('player.name', (data) => {
    if (!player.name) {
      player.name = data.name;
      socket.emit('name', { success: true });
    } else {
      socket.emit('name', { success: false, name: player.name });
    }
  });

  socket.on('room.create', () => {
    const name = uuid();
    socket.join(name, () => {
      console.log(io.sockets.adapter.rooms);
      const room = new Room(name, io.sockets.in(name));
      room.addPlayer(player);
      rooms[name] = room;
      player.playerRoom = room;
      room.emit('player joined room', { name: player.name });
    });
  });

  socket.on('room.join', (data) => {
    const room = rooms[data.room];
    if (room) {
      player.room = room;
      room.addPlayer(player);
    } else {
      socket.emit('join', { succes: false });
    }
  });

  socket.on('room.leave', (data) => {
    socket.leave(data.room);
    socket.emit('rooms', io.sockets.adapter.rooms);
  });

  socket.on('room.list', () => {
    socket.emit('rooms', io.sockets.adapter.rooms);
  });

  socket.on('player', () => {
    socket.emit('player', player.name);
  });

  socket.on('reconnect', () => {
    console.log('reconnect');
  });
});

server.listen(1337);
