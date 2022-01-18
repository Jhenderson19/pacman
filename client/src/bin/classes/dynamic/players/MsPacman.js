const Pacman = require('./Pacman');

module.exports = class MsPacman extends Pacman {

  static entID = 'player_ms-pacman';

  constructor(options) {
    super(options);
  }
}