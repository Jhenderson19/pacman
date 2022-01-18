const Ghost = require('./Ghost');

module.exports = class Clyde extends Ghost{

  static entID = 'ghost_clyde';

  constructor(options) {
    super(options);

    this.colors = 'FFB851';
    this.direction = 'south';
    this.trapped = options.trapped !== undefined ? options.trapped : true;
    this.defaultPathfinding = 'shy';
  }
}