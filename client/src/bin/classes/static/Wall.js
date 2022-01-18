const Entity = require('../entity');

module.exports = class Wall extends Entity {

  static entID = 'static_wall';

  constructor(options = {}) {
    super(options);

    this.pathable = false;
    this.hidden = options.hidden ? true : false;
  }

  prepDraw(canvas) {
    if (!this.hidden) {
      let pixeldata = this.getPixelData();
      this._renderData.cObject = canvas.display.rectangle({
        ...pixeldata,
        fill: '#000',
        stroke: 'inside 2px #00f'
      });
      canvas.addChild(this._renderData.cObject);
    }
    this._renderData.ready = true;
  }

  draw(data) {
    return null;
  }
}