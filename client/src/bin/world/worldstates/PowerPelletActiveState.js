const GameState = require('./GameState');

module.exports = class PowerPelletActiveState extends GameState {
  static stateId = 'PowerPelletActive';

  constructor(options) {
    super(options);
    this.refreshable = true;
  }
};