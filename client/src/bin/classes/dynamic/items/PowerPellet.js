const Pellet = require('./Pellet');

module.exports = class PowerPellet extends Pellet {
  constructor(options) {
    super(options);
    this.entID = 'item_powerpellet';
    this.duration = 8;
  }
  collect(eventHandler) {
    super.collect(eventHandler);
    eventHandler.registerEvent('powerPelletCollect', (board) => {
        console.log('POWERPELLET COLLECTED! GET EM BOYS');
        board.addStateTemporary('ScaredGhosts', this.duration);
    });
  }
  prepDraw(canvas) {
    super.prepDraw(canvas);
    this._renderData.cObject.radius *= 4;
  }
  draw(data) {
    this._renderData.cObject.fill = data.frame % 20 > 10 ?  '#000' : '#' + this.colors;
  }
}