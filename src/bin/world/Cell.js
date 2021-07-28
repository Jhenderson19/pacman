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
    var results = [];
    for (let i in this.contents) {
      if(typeof entID === 'string') {
        if(this.contents[i].entID === entID) {
          return this.contents[i];
        }
      } else if (entID instanceof RegExp) {
        if(entID.test(this.contents[i].entID)) {
          results.push(this.contents[i]);
        }
      }
    }
    if(entID instanceof RegExp){
      if(results.length === 0) {
        return false;
      }
      return results;
    }
    return false;
  }
  listTypes() {
    var results = [];
    for(let i in this.contents){
      results.push(this.contents[i].entID);
    }
    return results;
  }
}

module.exports = Cell;