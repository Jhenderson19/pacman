module.exports = class Entity {
  constructor(options = {}) {
    this.posX = options.posX;
    this.posY = options.posY;
    this.pathable = options.pathable;
  }
}