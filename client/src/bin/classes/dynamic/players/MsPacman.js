const Pacman = require('./Pacman');
let entID = 'player_ms-pacman';
module.exports = class MsPacman extends Pacman {
  constructor(options) {
    super(options);
    this.entID = entID;
  }
  static entID = 'player_ms-pacman';
}