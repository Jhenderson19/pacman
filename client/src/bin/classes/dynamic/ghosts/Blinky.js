const Ghost = require('./Ghost');
let entID = 'ghost_blinky';
module.exports = class Blinky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = 'FF0000';
    this.direction = 'west';
    this.entID = entID;
    this.trapped = options.trapped !== undefined ? options.trapped : false;
    this.defaultPathfinding = 'aggressive';
  }
  static entID = entID;
}