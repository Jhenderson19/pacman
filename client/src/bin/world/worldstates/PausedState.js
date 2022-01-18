const GameState = require('./GameState');

module.exports = class PausedState extends GameState {
  static stateId = 'paused';

  constructor(options) {
    super(options);
  }

  onAdd() {
    super.onAdd();
    return () => {};
  }

  onRemove() {
    super.onRemove();
    return () => {};
  }
};