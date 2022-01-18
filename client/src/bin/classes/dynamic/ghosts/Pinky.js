const Ghost = require('./Ghost');

module.exports = class Pinky extends Ghost{

  static entID = 'ghost_pinky';

  constructor(options) {
    super(options);
    this.colors = 'FFB8FF';
    this.direction = 'north';
    this.trapped = options.trapped !== undefined ? options.trapped : true;
    this.defaultPathfinding = 'aimAhead';
  }
}