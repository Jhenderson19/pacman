const Cell = require('../world/Cell');
const Entity = require('../classes/entity');

module.exports = {
  //Functions
  /**
   *
   * @param {Cell} cell
   * @returns
   */
  spawnConditions: (cell) => {
    let pathables = {
      north: cell.neighbors.north.pathable(),
      south: cell.neighbors.south.pathable(),
      east: cell.neighbors.east.pathable(),
      west: cell.neighbors.west.pathable(),
    }
    let updown = pathables.north || pathables.south;
    let leftright = pathables.east || pathables.west;
    let center = cell.pathable()

    return updown && leftright && center;
  },
  /**
   *
   * @param {Cell} cell
   * @returns
   */
  getPathables: (cell) => {
    return {
      north: cell.neighbors.north.pathable(),
      south: cell.neighbors.south.pathable(),
      east: cell.neighbors.east.pathable(),
      west: cell.neighbors.west.pathable()
    }
  },
  /**
   *
   * @param {Entity} pathingObject
   * @returns
   */
  getHasMovedSinceLastTurn: (pathingObject) => {
    return pathingObject.x !== pathingObject.lastTurnLoc.x || pathingObject.y !== pathingObject.lastTurnLoc.y;
  },

  /**
   *
   * @param {Entity} object
   * @param {{east: boolean, west: boolean, north: boolean, south: boolean}} pathables
   * @param {boolean} gridlocked
   */
  calculateOffsets: (object, pathables, gridlocked = true) => {
    switch(object.direction) {
      case 'north':
        if (gridlocked) {
          object.offsetx = 0;
        }
        object.offsety -= object.speed * object.speedMult;
        if(!pathables.north && object.offsety < 0) {
          object.offsety = 0;
        }
        break;
      case 'east':
        if (gridlocked) {
          object.offsety = 0;
        }
        object.offsetx += object.speed * object.speedMult;
        if(!pathables.east && object.offsetx > 0) {
          object.offsetx = 0;
        }
        break;
      case 'south':
        if (gridlocked) {
          object.offsetx = 0;
        }
        object.offsety += object.speed * object.speedMult;
        if(!pathables.south && object.offsety > 0 ) {
          object.offsety = 0;
        }
        break;
      case 'west':
        if (gridlocked) {
          object.offsety = 0;
        }
        object.offsetx -= object.speed * object.speedMult;
        if(!pathables.west && object.offsetx < 0) {
          object.offsetx = 0;
        }
        break;
    }
  },
  /**
   *
   * @param {Entity} pathingObject
   * @returns
   */
  getIsNearMiddleOfCell: (pathingObject) => {
    return Math.max(Math.abs(pathingObject.offsetx), Math.abs(pathingObject.offsety)) < pathingObject.speed;
  },
  /**
   * Returns distance between 2 objects with X and Y properties
   * @param {{x: number, y: number}} a
   * @param {{x: number, y: number}} b
   * @returns
   */
  distance: (a, b) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  },

  //Data
  opposite: {
    north: 'south',
    south: 'north',
    east: 'west',
    west: 'east'
  }
}