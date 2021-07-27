const Entity = require('../entity');

module.exports = class Warp extends Entity {
  constructor(options = {}) {
    super(options);
    this.pathable = true;
    this.entID = 'static_warp';
    if(!options.destination) {
      throw `No Destination on Warp with id ${options.id}`;
    }
    this.destination = options.destination;
  }
}