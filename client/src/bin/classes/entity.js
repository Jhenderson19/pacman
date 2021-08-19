module.exports = class Entity {
  constructor(options = {}) {
    if (options.id === undefined) {
      throw `Entity Spawned without ID!`;
    }

    this.x = options.x;
    this.y = options.y;
    this.offsetx = 0; //-100 exit cell to left, 100 exit cell to right
    this.offsety = 0; //-100 exit cell to go up, 100 exit cell to go down
    this.pathable = options.pathable !== undefined ? options.pathable : true;

    this._renderData = {
      ready: false,
      posMult: window.defaultTileSize,
      pixelHeight: window.defaultTileSize,
      pixelWidth: window.defaultTileSize,
      pixelXOffset: 0,
      pixelYOffset: 0
    }
    this.id = options.id;
  }
  getPixelData() {
    return {
      x: (this.x * this._renderData.posMult + this._renderData.pixelXOffset) + (this._renderData.posMult * (this.offsetx / 201)),
      y: (this.y * this._renderData.posMult + this._renderData.pixelYOffset) + (this._renderData.posMult * (this.offsety / 201)),
      width: this._renderData.pixelWidth,
      height: this._renderData.pixelHeight
    }
  }
  moveCells(cell, boardMetadata) {
    if(!cell) {
      console.log('NO CELL!');
    }
    if(!cell.neighbors) {
      console.log('NO CELL NEIGHBORS!');
      console.log(cell);
      debugger;
    }
    if(this.offsetx < -100) {
      this.x--;
      this.x < 0 ? this.x = boardMetadata.width - 1: null;
      this.offsetx += 201;
      cell.remove(this);
      cell.neighbors.west.insert(this);
    } else if(this.offsetx > 100) {
      this.x++;
      this.x >= boardMetadata.width ? this.x = 0: null;
      this.offsetx -= 201;
      cell.remove(this);
      cell.neighbors.east.insert(this);
    }
    if(this.offsety < -100) {
      this.y--;
      this.y < 0 ? this.y = boardMetadata.height - 1: null;
      this.offsety += 201;
      cell.remove(this);
      cell.neighbors.north.insert(this);
    } else if(this.offsety > 100) {
      this.y++;
      this.y > boardMetadata.height ? this.y = 0: null;
      this.offsety -= 201;
      cell.remove(this);
      cell.neighbors.south.insert(this);
    }
  }
}