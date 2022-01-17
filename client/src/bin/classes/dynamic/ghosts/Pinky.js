const Ghost = require('./Ghost');
let entID = 'ghost_pinky';

module.exports = class Pinky extends Ghost{

  static entID = entID;

  constructor(options) {
    super(options);
    this.entID = entID;

    this.colors = 'FFB8FF';
    this.direction = 'north';
    this.trapped = options.trapped !== undefined ? options.trapped : true;
    this.defaultPathfinding = 'aimAhead';
  }
}