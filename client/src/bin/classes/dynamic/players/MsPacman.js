const Pacman = require('./Pacman');
let entID = 'player_ms-pacman';

module.exports = class MsPacman extends Pacman {

  static entID = entID;

  constructor(options) {
    super(options);
    this.entID = entID;
  }
}