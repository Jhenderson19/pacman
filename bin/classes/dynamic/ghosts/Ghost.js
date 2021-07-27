const Entity = require('../../entity');

module.exports = class Ghost extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 1;
    this.colors = '1E1E1E';
    this.direction = 'east';
    this.entID = 'ghost_default';
    this.offsetx = -100;
  }
}