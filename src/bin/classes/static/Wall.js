const Entity = require('../entity');

module.exports = class Wall extends Entity {
  constructor(options = {}) {
    super(options);
    this.pathable = false;
    this.entID = 'static_wall';
  }

  prepDraw(canvas) {
    let pixeldata = this.getPixelData();
    this._renderData.render = canvas.display.rectangle({
      ...pixeldata,
      fill: '#000',
      stroke: 'inside 2px #00f'
    });
    canvas.addChild(this._renderData.render);
    this._renderData.ready = true;
  }

  draw(canvas, frame, cell, player, ghosts = []) {

  }
}