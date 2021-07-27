module.exports = class Entity {
  constructor(options = {}) {
    if (options.id === undefined) {
      throw `Entity Spawned without ID!`;
    }

    this.x = options.x;
    this.y = options.y;
    this.pathable = options.pathable;
    this.id = options.id;
  }
}