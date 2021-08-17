const Ghost = require('./Ghost');

module.exports = class Inky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = '00FFFF';
    this.direction = 'down';
    this.entID = 'ghost_inky';
  }
}