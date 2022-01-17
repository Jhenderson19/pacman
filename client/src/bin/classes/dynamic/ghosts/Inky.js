const Ghost = require('./Ghost');
let entID = 'ghost_inky';

module.exports = class Inky extends Ghost{

  static entID = entID;

  constructor(options) {
    super(options);
    this.entID = entID;

    this.colors = '00FFFF';
    this.direction = 'south';
    this.trapped = (options.trapped !== undefined ? options.trapped : true);
    this.defaultPathfinding = 'ambush';
  }
}