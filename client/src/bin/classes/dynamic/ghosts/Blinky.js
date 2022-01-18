const Ghost = require('./Ghost');

module.exports = class Blinky extends Ghost{

  static entID = 'ghost_blinky';

  constructor(options) {
    super(options);
    this.colors = 'FF0000';
    this.direction = 'west';
    this.trapped = options.trapped !== undefined ? options.trapped : false;
    this.defaultPathfinding = 'aggressive';
  }
}