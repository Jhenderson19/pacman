const Entity = require('../../entity');
let entID = 'item_pellet'
module.exports = class Pellet extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.entID = entID;
    this.colors = 'FFCCCC'

    //Render Help
    this._renderData.pixelXOffset = this._renderData.posMult/2;
    this._renderData.pixelYOffset = this._renderData.posMult/2;
  }
  static entID = entID;
  collect(eventHandler) {
    eventHandler.registerEvent('pelletCollect', (board) => {});
    this.markForDelete();
  }
  prepDraw(canvas) {
    let pixeldata = this.getPixelData();
    this._renderData.cObject = canvas.display.ellipse({
      x: pixeldata.x,
      y: pixeldata.y,
      fill: '#' + this.colors,
      radius: this._renderData.posMult / 10
    })
    canvas.addChild(this._renderData.cObject);
    this._renderData.ready = true;
  }
  draw(canvas) {

  }
}