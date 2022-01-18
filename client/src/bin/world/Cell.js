const Entity = require('../classes/entity');
module.exports = class Cell {
  /**
   * Constructs a cell containing all entities in an array
   * @param {Entity[]} entities
   */
  constructor(entities = []) {
    /** @type {Entity[]} */
    this.contents = entities.slice(0);
    /** @type {{north: Cell, south: Cell, east: Cell, west: Cell}} */
    this.neighbors = [];
  }

  /**
   * Adds an entity to this cell
   * @param {Entity} entity
   */
  insert(entity) {
    this.contents.push(entity);
  }

  /**
   * Removes an entity by reference from the cell
   * @param {Entity} entity
   * @returns {boolean} removal successful?
   */
  remove(entity) {
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i] === entity) {
        this.contents.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @param {string | RegExp} entID
   * @returns
   */
  contains(entID) {
    var results = [];
    for (let i in this.contents) {
      if (typeof entID === 'string') {
        if (this.contents[i].entID === entID) {
          return [this.contents[i]];
        }
      } else if (entID instanceof RegExp) {
        if (entID.test(this.contents[i].entID)) {
          results.push(this.contents[i]);
        }
      }
    }
    if (entID instanceof RegExp) {
      if (results.length === 0) {
        return [];
      }
      return results;
    }
    return [];
  }

  /**
   * Returns a list of entID strings for every entity contained in the cell
   * @returns {string[]}
   */
  listTypes() {
    var results = [];
    for (let i in this.contents) {
      results.push(this.contents[i].entID);
    }
    return results;
  }

  /**
   * Returns true if nothing in cell is unpathable
   * @returns {boolean}
   */
  pathable() {
    if(this.contents.length === 0) { return true };
    for (let entity in this.contents) {
      if (this.contents[entity].pathable === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Informs the cell of the neighboring cells to this one
   * @param {{north: Cell, south: Cell, east: Cell, west: Cell}} neighbors
   */
  _setNeighbors(neighbors) {
    if(this.neighbors.length === 0) {
      this.neighbors = neighbors;
    } else {
      throw 'Cell._setNeighbors to be called once only!';
    }
  }

}