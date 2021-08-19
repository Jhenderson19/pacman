const Ghost = require('./Ghost');

module.exports = class Inky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = '00FFFF';
    this.direction = 'south';
    this.entID = 'ghost_inky';
    this.trapped = (options.trapped !== undefined ? options.trapped : true);
  }
}