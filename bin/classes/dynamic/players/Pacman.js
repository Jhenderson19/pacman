const Entity = require('../../entity');

module.exports = class Pacman extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 1;
    this.entID = 'player_pacman';
    this.offsetx = -100;
  }
}