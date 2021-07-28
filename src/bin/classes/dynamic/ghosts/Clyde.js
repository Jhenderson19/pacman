const Ghost = require('./Ghost');

module.exports = class Clyde extends Ghost{
  constructor(options) {
    super(options);
    this.colors = 'FFB851';
    this.direction = 'down';
    this.entID = 'ghost_clyde';
  }
}