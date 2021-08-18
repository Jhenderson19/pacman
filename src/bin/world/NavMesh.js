const Entity = require('../classes/entity');

class NavNode extends Entity {
  constructor(options) {
    super(options);
  }
}

module.exports = class NavMesh {
  constructor(x = 1, y = 1, board) {

    this.navNodes = {}

    var crawlMaze = () => {
      let visited = {}
      let crawl = () => {

      }
    }
  }
}