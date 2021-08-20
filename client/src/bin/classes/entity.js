let entID = 'entity';
module.exports = class Entity {
  constructor(options = {}) {
    if (options.id === undefined) {
      throw `Entity Spawned without ID!`;
    }
    this.entID = entID;
    this.id = options.id;
    this.x = options.x;
    this.y = options.y;
    this.offsetx = 0; //-100 exit cell to left, 100 exit cell to right
    this.offsety = 0; //-100 exit cell to go up, 100 exit cell to go down
    this.pathable = options.pathable !== undefined ? options.pathable : true;

    this.markedForDelete = false;

    this._renderData = {
      ready: false,
      posMult: window.defaultTileSize,
      pixelHeight: window.defaultTileSize,
      pixelWidth: window.defaultTileSize,
      pixelXOffset: 0,
      pixelYOffset: 0
    }
  }
  static entID = entID;
  markForDelete() {
    this.markedForDelete = true;
    if (this._renderData.cObject) {
      this._renderData.cObject.remove();
    }
  }
  getPixelData() {
    return {
      x: (this.x * this._renderData.posMult + this._renderData.pixelXOffset) + (this._renderData.posMult * (this.offsetx / 201)),
      y: (this.y * this._renderData.posMult + this._renderData.pixelYOffset) + (this._renderData.posMult * (this.offsety / 201)),
      width: this._renderData.pixelWidth,
      height: this._renderData.pixelHeight
    }
  }
  moveCells(cell, board) {
    if(!cell || !cell.neighbors) {
      throw 'cell was not passed to moveCell';
    }
    if(this.offsetx < -100) {
      this.x--;
      this.x < 0 ? this.x = board.width - 1: null;
      this.offsetx += 201;
      cell.remove(this);
      board.getCell(this.x, this.y).insert(this);
    } else if(this.offsetx > 100) {
      this.x++;
      this.x >= board.width ? this.x = 0: null;
      this.offsetx -= 201;
      cell.remove(this);
      board.getCell(this.x, this.y).insert(this);
    }
    if(this.offsety < -100) {
      this.y--;
      this.y < 0 ? this.y = board.height - 1: null;
      this.offsety += 201;
      cell.remove(this);
      board.getCell(this.x, this.y).insert(this);
    } else if(this.offsety > 100) {
      this.y++;
      this.y >= board.height ? this.y = 0: null;
      this.offsety -= 201;
      cell.remove(this);
      board.getCell(this.x, this.y).insert(this);
    }
  }
}