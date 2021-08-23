const Entity = require('../classes/entity');

//
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

class NavNode extends Entity {
  constructor(options) {
    super(options);
    this.cell = options.cell;
    this.entID = 'ai_navnode';
    this.connectedNodes = {};

    //Render Help
    this._renderData.pixelXOffset = this._renderData.posMult/2;
    this._renderData.pixelYOffset = this._renderData.posMult/2;
  }
  static entID = 'ai_navnode';
  pointOnEdge(point, direction) {
    let nextNode = this.connectedNodes[direction];
    if(!nextNode) {return false;}

    let inRange = (x, min, max) => {
      return ((x-min)*(x-max) <= 0);
    };

    switch (direction) {
      case 'north':
      case 'south':
        return (this.x === point.x && this.connectedNodes[direction].x === point.x && inRange(point.y, this.y, nextNode.y));
      case 'east':
      case 'west':
        return (this.y === point.y && this.connectedNodes[direction].y === point.y && inRange(point.x, this.x, nextNode.x));
    }
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
      }
    }
  }
  distance (t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  prepDraw(canvas) {
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
  draw(canvas) {

  }
}

module.exports = class NavMesh {
  constructor(board) {
    this.nodes = [];
    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height; y++) {
        let cell = board.getCell(x, y);
        if (spawnConditions(board.getCell(x, y))) {
          this.nodes.push(board.spawn(NavNode, { x, y, cell }));
        }
      }
    }
  }
  getPath(navNode, direction, destination, distanceTraveled = 0, depth = 0) {
    let costs = {}; //heuristic cost of each direction (h(n))

    var getOpposite = (direction) => {
      switch (direction) {
        case 'north':
          return 'south'
        case 'east':
          return 'west';
        case 'south':
          return 'north';
        case 'west':
          return 'east';
      }
    }
    var bannedDir = getOpposite(direction);

    for(let direction in navNode.connectedNodes) {
      if(direction !== bannedDir) {
        if (!navNode.pointOnEdge(destination, direction) && depth < 4) {
          let distToNextNode = navNode.distance(navNode.connectedNodes[direction]);
          costs[direction] = this.getPath(navNode.connectedNodes[direction], direction, destination, distToNextNode, depth + 1).cost + distanceTraveled;
        } else {
          costs[direction] = navNode.distance(destination) + distanceTraveled;
        }
      }
    }

    let priority = Object.keys(costs);

    priority.sort((a, b) => {
      return costs[a] - costs[b];
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