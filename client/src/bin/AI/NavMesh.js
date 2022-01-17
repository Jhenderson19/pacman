const Entity = require('../classes/entity');

//helper functions
let spawnConditions = (cell) => {
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
}

//helper data
let opposite = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east'
};

class NavNode extends Entity {

  static entID = 'ai_navnode';

  constructor(options) {
    super(options);
    this.entID = NavNode.entID;

    this.cell = options.cell;
    this.connectedNodes = {};
    this.edges = {
      north:{},
      east:{},
      south:{},
      west:{},
    };
    //Render Help
    this._renderData.pixelXOffset = this._renderData.posMult/2;
    this._renderData.pixelYOffset = this._renderData.posMult/2;
  }

  connect() {
    let directions = ['north', 'east', 'south', 'west'];
    for (let dir in directions) {
      let curCell = this.cell.neighbors[directions[dir]];
      if(curCell.pathable()) {
        while (!curCell.contains('ai_navnode')) {
          curCell = curCell.neighbors[directions[dir]];
        }
        let node = curCell.contains('ai_navnode');
        this.connectedNodes[directions[dir]] = node;
        this.registerEdgesTo(node);
      }
    }
  }

  registerEdgesTo(node) {

    if(this.x === node.x) {  //Share an edge on the X axis
      let s = this.y;
      if(s < node.y) {
        let d = 'south';
        while(s <= node.y) {
          s = (s + 1 + NavNode.boardHeight) % NavNode.boardHeight;
          this.edges[d][`(x:${this.x},y:${s})`] = true;
        }
      } else if (s > node.y) {
        let d = 'north';
        while(s >= node.y) {
          s = (s - 1 + NavNode.boardHeight) % NavNode.boardHeight;
          this.edges[d][`(x:${this.x},y:${s})`] = true;
        }
      }

    } else if(this.y === node.y) { //Share an edge on the Y axis
      let s = this.x;
      if(s < node.x) {
        let d = 'east';
        while(s <= node.x) {
          s = (s + 1 + NavNode.boardWidth) % NavNode.boardWidth;
          this.edges[d][`(x:${s},y:${this.y})`] = true;
        }
      } else if (s > node.x) {
        let d = 'west';
        while(s >= node.x) {
          s = (s - 1 + NavNode.boardWidth) % NavNode.boardWidth;
          this.edges[d][`(x:${s},y:${this.y})`] = true;
        }
      }
    }
  }

  getIsPointOnEdge(direction, point) {
    return this.edges[direction][`(x:${point.x},y:${point.y})`] !== undefined;
  }

  distance(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }

  distanceToNextNode(direction) {
    return Object.keys(this.edges[direction]).length;
  }

  prepDraw(canvas) {
    if(window.pacmanConfig.renderNavModes) {
      let pixeldata = this.getPixelData();
      this._renderData.cObject = canvas.display.ellipse({
        x: pixeldata.x,
        y: pixeldata.y,
        fill: '#0F0',
        radius: this._renderData.posMult / 4
      })
      canvas.addChild(this._renderData.cObject);
      this._renderData.ready = true;
    }
  }

  draw(data) {
    return null;
  }
}

module.exports = class NavMesh {

  constructor(board) {
    NavNode.boardWidth = board.width;
    NavNode.boardHeight = board.height;
    this.nodes = [];
    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {
        let cell = board.getCell(x, y);
        if (spawnConditions(board.getCell(x, y))) {
          this.nodes.push(board.spawn(NavNode, { x, y, cell}));
        }
      }
    }
  }

  getPath(navNode, direction, destination, distanceTraveled = 0, depth = 0) {
    let costs = {}; //heuristic cost of each direction (h(n))
    var bannedDir = opposite[direction];

    for(let direction in navNode.connectedNodes) {
      if(direction !== bannedDir) {
        if (!navNode.getIsPointOnEdge(direction, destination) && depth < 8) {
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
    console.log('connecting all nodes');
    for(let node in this.nodes) {
      this.nodes[node].connect();
    }
  }

}