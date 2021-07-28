const Ghost = require('./Ghost');

module.exports = class Blinky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = 'FF0000';
    this.direction = 'west';
    this.entID = 'ghost_blinky';
  }
}