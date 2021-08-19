const Ghost = require('./Ghost');

module.exports = class Pinky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = 'FFB8FF';
    this.direction = 'north';
    this.entID = 'ghost_pinky';
    this.trapped = options.trapped !== undefined ? options.trapped : true;
  }
}