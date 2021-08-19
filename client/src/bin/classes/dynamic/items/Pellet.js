const Entity = require('../../entity');

module.exports = class Pellet extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.entID = 'item_pellet';

    //Render Help
    this._renderData.pixelXOffset = this._renderData.posMult/2;
    this._renderData.pixelYOffset = this._renderData.posMult/2;
  }
  collect() {
    console.log('pellet collected!');
    this.markForDelete();
  }
  prepDraw(canvas) {

    let pixeldata = this.getPixelData();
    this._renderData.cObject = canvas.display.ellipse({
      x: pixeldata.x,
      y: pixeldata.y,
      fill: '#FCC',
      radius: this._renderData.posMult / 10
    })
    canvas.addChild(this._renderData.cObject);
    this._renderData.ready = true;
  }
  draw(canvas) {

  }
}