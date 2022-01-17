class Cell {

  constructor(objects = []) {
    this.contents = objects.slice(0);
    this.neighbors = [];
  }

  insert(object) {
    this.contents.push(object);
  }

  remove(object) {
    /*
      Removes an object by reference from a cell.
    */
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i] === object) {
        this.contents.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  contains(entID) {
    var results = [];
    for (let i in this.contents) {
      if (typeof entID === 'string') {
        if (this.contents[i].entID === entID) {
          return this.contents[i];
        }
      } else if (entID instanceof RegExp) {
        if (entID.test(this.contents[i].entID)) {
          results.push(this.contents[i]);
        }
      }
    }
    if (entID instanceof RegExp) {
      if (results.length === 0) {
        return false;
      }
      return results;
    }
    return false;
  }

  listTypes() {
    var results = [];
    for (let i in this.contents) {
      results.push(this.contents[i].entID);
    }
    return results;
  }

  pathable() {
    if(this.contents.length === 0) { return true };
    for (let entity in this.contents) {
      if (this.contents[entity].pathable === false) {
        return false;
      }
    }
    return true;
  }

  _setNeighbors(neighbors) {
    if(this.neighbors.length === 0) {
      this.neighbors = neighbors;
    } else {
      throw 'Cell._setNeighbors to be called once only!';
    }
  }

}

module.exports = Cell;