class Cell {
  constructor(objects = []) {
    this.contents = objects.slice(0);
  }
  insert(object) {
    this.contents.push(object);
  }
  remove(object) {
    /*
      Removes an object by reference from a cell.
    */
    for(let i = 0; i < this.contents.length; i++) {
      if (this.contents[i] === object) {
        this.contents.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  contains(entID) {
    for (let i in this.contents) {
      if(this.contents[i].entID === entID) {
        return this.contents[i];
      }
    }
    return false;
  }
}

module.exports = Cell;