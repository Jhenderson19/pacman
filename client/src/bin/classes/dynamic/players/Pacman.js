const Entity = require('../../entity');
let entID = 'player_pacman';
module.exports = class Pacman extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 30;
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
      radius: pixeldata.height * .95,
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
    let pathables = {
      north: data.cell.neighbors.north.pathable(),
      south: data.cell.neighbors.south.pathable(),
      east: data.cell.neighbors.east.pathable(),
      west: data.cell.neighbors.west.pathable()
    }
    if (data.pressedKeys.KeyW && Math.abs(this.offsetx) < this.speed && pathables.north) {
      this.direction = 'north';
    }
    if (data.pressedKeys.KeyD && Math.abs(this.offsety) < this.speed && pathables.east) {
      this.direction = 'east';
    }
    if (data.pressedKeys.KeyS && Math.abs(this.offsetx) < this.speed && pathables.south) {
      this.direction = 'south';
    }
    if (data.pressedKeys.KeyA && Math.abs(this.offsety) < this.speed && pathables.west) {
      this.direction = 'west';
    }

    switch(this.direction) {
      case 'north':
        this.offsetx = 0;
        this.offsety -= this.speed * this.speedMults[this.direction];
        if(!pathables.north && this.offsety < 0) {
          this.offsety = 0;
        }
        break;
      case 'east':
        this.offsety = 0;
        this.offsetx += this.speed * this.speedMults[this.direction];
        if(!pathables.east && this.offsetx > 0) {
          this.offsetx = 0;
        }
        break;
      case 'south':
        this.offsetx = 0;
        this.offsety += this.speed * this.speedMults[this.direction];
        if(!pathables.south && this.offsety > 0 ) {
          this.offsety = 0;
        }
        break;
      case 'west':
        this.offsety = 0;
        this.offsetx -= this.speed * this.speedMults[this.direction];
        if(!pathables.west && this.offsetx < 0) {
          this.offsetx = 0;
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