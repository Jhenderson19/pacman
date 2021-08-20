const Ghost = require('./Ghost');
let entID = 'ghost_inky';
module.exports = class Inky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = '00FFFF';
    this.direction = 'south';
    this.entID = entID;
    this.trapped = (options.trapped !== undefined ? options.trapped : true);
  }
  static entID = entID;
}