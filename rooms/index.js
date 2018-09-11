// const uuid = require('uuid');
// const Player = require('../players');

class Room {
  constructor(name, socket) {
    this.players = [];
    this.socket = socket;
    this.roomName = name;
  }

  get name() {
    return this.roomName;
  }

  addPlayer(player) {
    // this.players.push(new Player((playerName));
    this.players.push(player);
    this.socket.emit('player join', {
      success: true,
      name: player.name,
      players: this.players.map(x => x.name),
      room: this.roomName,
    });
  }

  rmPlayer(player) {
    player.leave(this.roomName, () => {
      this.players.splice(this.players.indexOf(player), 1);
    });
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }
}

module.exports = Room;
