const Entity = require('../../entity');

module.exports = class Ghost extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 20;
    this.speedMult = 1;
    this.colors = '1E1E1E';
    this.direction = 'east';
    this.entID = 'ghost_default';
    this.offsetx = -100;
    this.lastTurnLoc = {x: this.x, y: this.y};

    //Render Help
    this._renderData.pixelYOffset = this._renderData.posMult/2;
    this._renderData.pixelXOffset = this._renderData.posMult/2;
  }

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
  draw(data = {}) {
    let pixeldata = this.getPixelData();
    this._renderData.cObject.x = pixeldata.x;
    this._renderData.cObject.y = pixeldata.y;
  }
  readyToTurn(data) {
    let numOfpaths = 0;
    for(let direction in data.cell.neighbors) {
      if (data.cell.neighbors[direction].pathable()) {
        numOfpaths++;
      }
    }
    let optionToTurn = numOfpaths > 2 && !(this.x === this.lastTurnLoc.x && this.y === this.lastTurnLoc.y);

    let nextCellNotPathable = !data.cell.neighbors[this.direction].pathable();
    let closeToMiddle = Math.max(Math.abs(this.offsetx), Math.abs(this.offsety)) < this.speed;
    return (nextCellNotPathable || optionToTurn) && closeToMiddle;
  }
  pickTurnDirection(data) {
    console.log('Picking random direction!');
    while(true) {
      let possibleDirections = ['north', 'east', 'south', 'west'];
      let nDir = Math.floor(Math.random()*4);
      if (nDir === ((possibleDirections.indexOf(this.direction) + 2) % 4) || !data.cell.neighbors[possibleDirections[nDir]].pathable()) {
        continue;
      } else {
        this.direction = possibleDirections[nDir];
        this.lastTurnLoc.x = this.x;
        this.lastTurnLoc.y = this.y;
        return;
      }

    }
  }
  tick(data) {
    if (!this.trapped) {
      if(this.readyToTurn(data)) {
        this.pickTurnDirection(data);
      }
    } else {
      if(Math.abs(this.offsety) < this.speed && !data.cell.neighbors[this.direction].pathable()) {
        this.direction = this.direction === 'north' ? 'south' : 'north';
      }
    }
    switch(this.direction) {
      case 'east':
        this.offsetx += this.speed;
        if(!this.trapped) {
          this.offsety = 0;
        }
        break;
      case 'west':
        this.offsetx -= this.speed;
        if(!this.trapped) {
          this.offsety = 0;
        }
        break;
      case 'north':
        this.offsety -= this.speed;
        if(!this.trapped) {
          this.offsetx = 0;
        }
        break;
      case 'south':
        this.offsety += this.speed;
        if(!this.trapped) {
          this.offsetx = 0;
        }
        break;
    }
    this.moveCells(data.cell, data.board);
  }

}