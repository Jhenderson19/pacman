module.exports = class Entity {
  constructor(options = {}) {
    if (options.id === undefined) {
      throw `Entity Spawned without ID!`;
    }

    this.x = options.x;
    this.y = options.y;
    this.offsetx = 0; //-100 exit cell to left, 100 exit cell to right
    this.offsety = 0; //-100 exit cell to go up, 100 exit cell to go down
    this.pathable = options.pathable;

    this._renderData = {
      ready: false,
      posMult: 24,
      pixelHeight: 24,
      pixelWidth: 24,
      pixelXOffset: 0,
      pixelYOffset: 0
    }
    this.id = options.id;
  }
  getPixelData() {
    return {
      x: (this.x * this._renderData.posMult + this._renderData.pixelXOffset) + (this._renderData.posMult * (this.offsetx / 100)),
      y: (this.y * this._renderData.posMult + this._renderData.pixelYOffset) + (this._renderData.posMult * (this.offsety / 100)),
      width: this._renderData.pixelWidth,
      height: this._renderData.pixelHeight
    }
  }
}