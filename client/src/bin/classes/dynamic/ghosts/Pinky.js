const Ghost = require('./Ghost');
let entID = 'ghost_pinky';
module.exports = class Pinky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = 'FFB8FF';
    this.direction = 'north';
    this.entID = entID;
    this.trapped = options.trapped !== undefined ? options.trapped : true;
    this.defaultPathfinding = 'aimAhead';
  }
  static entID = entID;
}