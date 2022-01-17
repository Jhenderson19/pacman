const Entity = require('../entity');
let entID = 'static_ghostgate';

module.exports = class GhostGate extends Entity {

  static entID = entID;

  constructor(options = {}) {
    super(options);
    this.entID = entID;

    this.pathable = false;
    this.hidden = false;
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

  draw(data) {
    return null;
  }
}