const Ghost = require('./Ghost');
let entID = 'ghost_clyde';

module.exports = class Clyde extends Ghost{

  static entID = entID;

  constructor(options) {
    super(options);
    this.entID = entID;

    this.colors = 'FFB851';
    this.direction = 'south';
    this.trapped = options.trapped !== undefined ? options.trapped : true;
    this.defaultPathfinding = 'shy';
  }
}