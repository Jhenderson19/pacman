const Pathfinding = require('../../../AI/Pathfinding');
const Entity = require('../../entity');
let entID = 'ghost_default';
module.exports = class Ghost extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 30;
    this.speedMult = 1;
    this.colors = '1E1E1E';
    this.direction = 'east';
    this.entID = entID;
    this.offsetx = -100;
    this.lastTurnLoc = {x: this.x, y: this.y};
    this.defaultPathfinding = 'random';

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
    if( data.checkState('ScaredGhosts') ) {
      this._renderData.cObject.fill = data.frame % 30 > 15 ? '#FFF' : '#00F';
    } else {
      this._renderData.cObject.fill = '#' + this.colors;
    }
  }

  tick(data) {
    if(data.checkState('scaredghosts')) {
      this.speedMult = .45;
    } else {
      this.speedMult = 1;
    }

    if (!this.trapped) {
      Pathfinding[this.defaultPathfinding](this, data);
    } else {
      Pathfinding.ghostHouse(this, data);
    }
    switch(this.direction) {
      case 'east':
        this.offsetx += this.speed * this.speedMult;
        if(!this.trapped) {
          this.offsety = 0;
        }
        break;
      case 'west':
        this.offsetx -= this.speed * this.speedMult;
        if(!this.trapped) {
          this.offsety = 0;
        }
        break;
      case 'north':
        this.offsety -= this.speed * this.speedMult;
        if(!this.trapped) {
          this.offsetx = 0;
        }
        break;
      case 'south':
        this.offsety += this.speed * this.speedMult;
        if(!this.trapped) {
          this.offsetx = 0;
        }
        break;
    }
    this.moveCells(data.cell, data.board);
  }

  collide(data, eventHandler){

  }
}
