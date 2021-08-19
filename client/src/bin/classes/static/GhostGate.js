const Entity = require('../entity');

module.exports = class GhostGate extends Entity {
  constructor(options = {}) {
    super(options);
    this.pathable = false;
    this.hidden = false;
    this.entID = 'static_ghostgate';
    this._renderData.pixelHeight = 4;
    this._renderData.pixelYOffset += this._renderData.posMult/3;
  }
  prepDraw(canvas) {
    let pixeldata = this.getPixelData();
    this._renderData.cObject = canvas.display.rectangle({
      ...pixeldata,
      fill: '#FFF'
    });
    canvas.addChild(this._renderData.cObject);
    this._renderData.ready = true;
  }
  draw(canvas, frame, cell, player, ghosts = []) {

  }
}