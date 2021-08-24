const Pathfinding = require('../../../AI/Pathfinding');
const Entity = require('../../entity');
let entID = 'ghost_default';
module.exports = class Ghost extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 30;
    this.speedMult = 1;
    this.defaultSpeedMult = 1;
    this.colors = '1E1E1E';
    this.direction = 'east';
    this.entID = entID;
    this.offsetx = -100;
    this.lastTurnLoc = {x: this.x, y: this.y};
    this.scatterHome = {x: this.x, y: this.y};
    this.defaultPathfinding = 'random';
    this.frightenedImmune = false;
    this.alive = true;

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
      radius: pixeldata.height * .95,
      fill: '#'+this.colors,
    });
    canvas.addChild(this._renderData.cObject);
    this._renderData.ready = true;
  }
  draw(data = {}) {
    let pixeldata = this.getPixelData();
    this._renderData.cObject.x = pixeldata.x;
    this._renderData.cObject.y = pixeldata.y;
    if( data.checkState('ScaredGhosts')  && !this.frightenedImmune ) {
      this._renderData.cObject.fill = data.frame % 30 > 15 ? '#FFF' : '#00F';
    } else {
      this._renderData.cObject.fill = '#' + this.colors;
    }
  }
  instantFree(x = 1, y = 1) {
    this.x = x;
    this.y = y;
    this.trapped = false;
    this.offsetx = -100;
    this.offsety = 0;
    this.direction = Math.random() > .5 ? 'east' : 'west';
  }
  tick(data) {
    if(data.checkState('scaredghosts') && !this.frightenedImmune) {
      this.speedMult = .45;
    } else {
      this.speedMult = this.defaultSpeedMult;
    }

    if (!this.trapped) {
      Pathfinding[this.defaultPathfinding](this, data);
    } else {
      Pathfinding.ghostHouse(this, data);
    }

    this.moveCells(data.cell, data.board);
  }
  setScatterHome(loc) {
    this.scatterHome.x = loc.x;
    this.scatterHome.y = loc.y;
  }
  killGhost(eventHandler) {
    if (!this.frightenedImmune) {
      console.log(this.entID + ' has been killed!');
      this.frightenedImmune = true;
      this.instantFree();
    }
  }
  collide(data, eventHandler){
    data.cell.contents.forEach(entity => {
      if(!data.checkState('scaredGhosts') || this.frightenedImmune) {
        entity.kill ? entity.kill(eventHandler) : null;
      }
    });
  }
}
