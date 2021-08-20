const Entity = require('../../entity');
let entID = 'player_pacman';
module.exports = class Pacman extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 25;
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
    let pixeldata = this.getPixelData();
    this._renderData.cObject.x = pixeldata.x;
    this._renderData.cObject.y = pixeldata.y;
  }
  tick(data) {
    if (data.pressedKeys.KeyW) {
      this.direction = 'north';
    }
    if (data.pressedKeys.KeyD) {
      this.direction = 'east';
    }
    if (data.pressedKeys.KeyS) {
      this.direction = 'south';
    }
    if (data.pressedKeys.KeyA) {
      this.direction = 'west';
    }

    switch(this.direction) {
      case 'north':
        this.offsetx = 0;
        this.offsety -= this.speed * this.speedMults[this.direction];
        if(!data.cell.neighbors.north.pathable() && this.offsety < this.speed * -1) {
           this.offsety = this.speed * -1;
        }
        break;
      case 'east':
        this.offsety = 0;
        this.offsetx += this.speed * this.speedMults[this.direction];
        if(!data.cell.neighbors.east.pathable() && this.offsetx > this.speed) {
          this.offsetx = this.speed;
        }
        break;
      case 'south':
        this.offsetx = 0;
        this.offsety += this.speed * this.speedMults[this.direction];
        if(!data.cell.neighbors.south.pathable() && this.offsety > this.speed ) {
          this.offsety = this.speed;
        }
        break;
      case 'west':
        this.offsety = 0;
        this.offsetx -= this.speed * this.speedMults[this.direction];
        if(!data.cell.neighbors.west.pathable() && this.offsetx < this.speed * -1) {
          this.offsetx = this.speed * -1;
        }
        break;
    }
    this.moveCells(data.cell, data.board);
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