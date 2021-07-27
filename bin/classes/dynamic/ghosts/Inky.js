const Ghost = require('./Ghost');

module.exports = class Inky extends Ghost{
  constructor(options) {
    super(options);
    this.colors = '00FFFFF';
  }
}