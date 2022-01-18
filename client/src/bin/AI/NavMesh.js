const NavNode = require('./NavNode');
const helpers = require('./helpers');

module.exports = class NavMesh {

  constructor(board) {
    NavNode.boardWidth = board.width;
    NavNode.boardHeight = board.height;
    this.nodes = [];
    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {
        let cell = board.getCell(x, y);
        if (helpers.spawnConditions(board.getCell(x, y))) {
          this.nodes.push(board.spawn(NavNode, { x, y, cell}));
        }
      }
    }
  }

  /**
   *
   * @param {NavNode} navNode
   * @param {string} direction
   * @param {{x: number, y: number}} destination
   * @param {number} distanceTraveled
   * @param {number} depth
   * @returns
   */
  getPath(navNode, direction, destination, distanceTraveled = 0, depth = 0) {
    let costs = {}; //heuristic cost of each direction (h(n))
    var bannedDir = helpers.opposite[direction];

    for(let direction in navNode.connectedNodes) {
      if(direction !== bannedDir) {
        let shouldRecurse = !navNode.getIsPointOnEdge(direction, destination) && depth < 8;
        if (shouldRecurse) {
          let distToNextNode = navNode.distanceToNextNode(direction);
          costs[direction] = this.getPath(navNode.connectedNodes[direction], direction, destination, distToNextNode, depth + 1).cost + distanceTraveled;
        } else {
          costs[direction] = navNode.distance(destination) + distanceTraveled;
        }
      }
    }

    let priority = Object.keys(costs);

    priority.sort((a, b) => {
      let t = costs[a] - costs[b];
      if (t === 0) {
        return Math.random() - .5
      } else {
        return t;
      }
    });

    let result = {
      direction: priority[0],
      cost: costs[priority[0]]
    }

    return result;
  }

  connectAll() {
    for(let node in this.nodes) {
      this.nodes[node].connect();
    }
  }

}