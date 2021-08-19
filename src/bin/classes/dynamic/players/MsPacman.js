const Pacman = require('./Pacman');

module.exports = class MsPacman extends Pacman {
  constructor(options) {
    super(options);
    this.entID = 'player_ms-pacman';
  }
}