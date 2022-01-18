const PowerPelletCollectEvent = require('../../../world/events/PowerPelletCollectEvent');
const Pellet = require('./Pellet');
module.exports = class PowerPellet extends Pellet {

  static entID = 'item_powerpellet';

  constructor(options) {
    super(options);
    this.duration = 8;
  }

  collect(eventHandler) {

    super.collect(eventHandler);

    eventHandler.registerEvent(new PowerPelletCollectEvent());

  }

  prepDraw(canvas) {
    super.prepDraw(canvas);
    this._renderData.cObject.radius *= 4;
  }

  draw(data) {
    this._renderData.cObject.fill = data.frame % 20 > 10 ?  '#000' : '#' + this.colors;
  }
}