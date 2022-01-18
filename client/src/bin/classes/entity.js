const Cell = require('../world/Cell');
const Board = require('../world/Board');

module.exports = class Entity {
  static entID = 'entity';

  constructor(options = {}) {
    if (options.id === undefined) {
      throw `Entity Spawned without ID!`;
    }
    /** @type {string} */
    this.entID = this.constructor.entID;
    this.id = options.id;
    this.x = options.x;
    this.y = options.y;
    this.offsetx = 0; //-100 exit cell to left, 100 exit cell to right
    this.offsety = 0; //-100 exit cell to go up, 100 exit cell to go down
    this.pathable = options.pathable !== undefined ? options.pathable : true;

    this.markedForDelete = false;

    this._renderData = {
      ready: false,
      posMult: window.pacmanConfig.defaultTileSize,
      pixelHeight: window.pacmanConfig.defaultTileSize,
      pixelWidth: window.pacmanConfig.defaultTileSize,
      pixelXOffset: 0,
      pixelYOffset: 0
    }
  }

  /**
   * updates an entity
   * @param {*} data
   */
  tick(data) {

  }

  /**
   * Prepares an entity to be drawn
   * @param {*} data
   * @returns
   */
  prepDraw(data) {
    return;
  }

  /**
   * Updates an object on the canvas
   * @param {*} data
   * @returns
   */
  draw(data){
    return;
  }

  /**
   * Marks an entity to be deleted from the board
   * @returns {void}
   */
  markForDelete() {
    this.markedForDelete = true;
    if (this._renderData.cObject) {
      this._renderData.cObject.remove();
    }
  }

  /**
   * Provides x and y coordinates with width and height for use by Ocanvas
   * @returns {{ x: Number, y: Number, width: Number, height: Number}} PixelData
   */
  getPixelData() {
    return {
      x: (this.x * this._renderData.posMult + this._renderData.pixelXOffset) + (this._renderData.posMult * (this.offsetx / 201)),
      y: (this.y * this._renderData.posMult + this._renderData.pixelYOffset) + (this._renderData.posMult * (this.offsety / 201)),
      width: this._renderData.pixelWidth,
      height: this._renderData.pixelHeight
    }
  }

  /**
   *
   * @param {Cell} cell
   * @param {Board} board
   */
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