class Player {
  constructor(socket) {
    // this.playerName = name;
    this.socket = socket;
    this.points = 0;
    this.playerName;
  }

  set name(name) {
    this.playerName = name;
  }

  get name() {
    return this.playerName;
  }

  set room(room) {
    this.playerRoom = room;
  }

  get room() {
    return this.playerRoom;
  }

  addPoints(toAdd) {
    this.points += toAdd;
    this.playerRoom.emit('player points', {player: this.playerName, points: this.points });
  }
}


module.exports = Player;
