const Entity = require('../../entity');
let entID = 'item_pellet'

module.exports = class Pellet extends Entity {

  static entID = entID;

  constructor(options) {
    super(options);
    this.entID = entID;

    this.pathable = true;
    this.colors = 'FFCCCC'

    //Render Help
    this._renderData.pixelXOffset = this._renderData.posMult/2;
    this._renderData.pixelYOffset = this._renderData.posMult/2;
  }

  collect(eventHandler) {
    eventHandler.registerEvent('PelletCollect', (board) => {});
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
    return null;
  }

}