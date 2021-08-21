const Ghost = require('./Ghost');
let entID = 'ghost_clyde';
module.exports = class Clyde extends Ghost{
  constructor(options) {
    super(options);
    this.colors = 'FFB851';
    this.direction = 'south';
    this.entID = entID;
    this.trapped = options.trapped !== undefined ? options.trapped : true;
    this.defaultPathfinding = 'shy';
  }
  static entID = entID;
}