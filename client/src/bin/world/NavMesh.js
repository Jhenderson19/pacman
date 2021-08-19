const Entity = require('../classes/entity');

class NavNode extends Entity {
  constructor(options) {
    super(options);
  }
}

module.exports = class NavMesh {
  constructor(board) {
    this.nodes = [];
    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {
        let nearCells = board.getCell(x, y).neighbors;
        let numOfPaths = 0;
        for(let direction in nearCells) {
          nearCells[direction].pathable() ? numOfPaths++ : null;
        }
      }
    }
  }
}