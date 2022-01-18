const Ghost = require('./Ghost');

module.exports = class Inky extends Ghost{

  static entID = 'ghost_inky';

  constructor(options) {
    super(options);
    this.colors = '00FFFF';
    this.direction = 'south';
    this.trapped = (options.trapped !== undefined ? options.trapped : true);
    this.defaultPathfinding = 'ambush';
  }
}