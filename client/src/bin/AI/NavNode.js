const Entity = require('../classes/entity');
const Cell = require('../world/Cell');

module.exports = class NavNode extends Entity {

  static entID = 'ai_navnode';

  constructor(options) {
    super(options);

    /** @type {Cell} */
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
      /** @type {Cell} */
      let curCell = this.cell.neighbors[directions[dir]];
      if(curCell.pathable()) {
        while (!curCell.contains('ai_navnode').length) {
          curCell = curCell.neighbors[directions[dir]];
        }
        let node = curCell.contains('ai_navnode')[0];
        this.connectedNodes[directions[dir]] = node;
        this.registerEdgesTo(node);
      }
    }
    debugger;
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

  /**
   *
   * @param {string} direction
   * @param {{x: number, y: number}} point
   * @returns {boolean}
   */
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
    if(window.pacmanConfig.renderNavNodes) {
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