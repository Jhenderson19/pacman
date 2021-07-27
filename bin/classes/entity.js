module.exports = class Entity {
  constructor(options = {}) {
    if (options.id === undefined) {
      throw `Entity Spawned without ID!`;
    }

    this.x = options.x;
    this.y = options.y;
    this.offsetx = 0; //-100 exit cell to left, 100 exit cell to right
    this.offsety = 0; //-100 exit cell to go up, 100 exit cell to go down
    this.pathable = options.pathable;
    this.id = options.id;
  }
}