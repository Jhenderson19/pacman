const Ghost = require('./Ghost');

module.exports = class Pinky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = 'FFB8FF';
    this.direction = 'up';
    this.entID = 'ghost_pinky';
  }
}