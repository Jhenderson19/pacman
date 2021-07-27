const Entity = require('../../entity');

module.exports = class Pellet extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.entID = 'item_pellet';
  }
}