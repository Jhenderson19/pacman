const Pellet = require('./Pellet');

module.exports = class PowerPellet extends Pellet {
  constructor(options) {
    super(options);
    this.entID = 'item_powerpellet';
  }
  collect() {
    super.collect();
    console.log('POWERPELLET COLLECTED! GET EM BOYS');
  }
  prepDraw(canvas) {
    super.prepDraw(canvas);
    this._renderData.cObject.radius *= 4;
  }
  draw(data) {
    this._renderData.cObject.fill = data.frame % 20 > 10 ?  '#000' : '#FCC';
  }
}