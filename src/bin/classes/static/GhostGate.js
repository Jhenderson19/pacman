const Entity = require('../entity');

module.exports = class GhostGate extends Entity {
  constructor(options = {}) {
    super(options);
    this.pathable = false;
    this.hidden = false;
    this.entID = 'static_ghostgate';
  }
}