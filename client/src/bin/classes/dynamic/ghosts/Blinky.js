const Ghost = require('./Ghost');
let entID = 'ghost_blinky';

module.exports = class Blinky extends Ghost{

  static entID = entID;

  constructor(options) {
    super(options);
    this.entID = entID;

    this.colors = 'FF0000';
    this.direction = 'west';
    this.trapped = options.trapped !== undefined ? options.trapped : false;
    this.defaultPathfinding = 'aggressive';
  }
}