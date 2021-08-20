const Entity = require('../../entity');
let entID = 'player_pacman';
module.exports = class Pacman extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 20;
    this.speedMults = {
      north: 1, south: 1, east: 1, west: 1
    }
    this.entID = entID;
    this.colors = 'ff0';
    this.offsetx = -100;
    this.direction = 'none';

    //Render Help
    this._renderData.pixelYOffset = this._renderData.posMult/2;
    this._renderData.pixelXOffset = this._renderData.posMult/2;
  }
  static entID = entID;
  prepDraw(canvas) {
    let pixeldata = this.getPixelData();
    this._renderData.cObject = canvas.display.ellipse({
      x: pixeldata.x,
      y: pixeldata.y,
      radius: pixeldata.height/2,
      fill: '#'+this.colors,
    });
    canvas.addChild(this._renderData.cObject);
    this._renderData.ready = true;
  }
  draw(canvas) {

  }
  tick(data) {
  }
  collide(data, eventHandler){
    for (let ent in data.cell.contents) {
      if(data.checkState('scaredGhosts')) {
        //Kill the ghost
      }
      data.cell.contents[ent].collect ? data.cell.contents[ent].collect(eventHandler) : null;
    }
  }
  kill(eventHandler) {
    console.log('killed',this);
  }
}