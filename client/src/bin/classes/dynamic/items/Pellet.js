const Entity = require('../../entity');
const PelletCollectEvent = require('../../../world/events/PelletCollectEvent');

module.exports = class Pellet extends Entity {

  static entID = 'item_pellet';

  constructor(options) {
    super(options);

    this.pathable = true;
    this.colors = 'FFCCCC'

    //Render Help
    this._renderData.pixelXOffset = this._renderData.posMult/2;
    this._renderData.pixelYOffset = this._renderData.posMult/2;
  }

  collect(eventHandler) {
    eventHandler.registerEvent(new PelletCollectEvent());
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

  draw(data) {
    return null;
  }

}