const Entity = require('../../entity');

module.exports = class Ghost extends Entity {
  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 20;
    this.colors = '1E1E1E';
    this.direction = 'east';
    this.entID = 'ghost_default';
    this.offsetx = -100;

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
  tick(data) {
    if (!this.trapped) {
      while(!data.cell.neighbors[this.direction].pathable() && Math.max(Math.abs(this.offsetx), Math.abs(this.offsety)) > (100 - this.speed)) {
        console.log(data.cell);
        console.log('Current Cell Pathability:', data.cell.pathable());
        console.log('Heading', this.direction);
        console.log('Next Cell Pathability:', data.cell.neighbors[this.direction].pathable());
        this.direction = ['north', 'west', 'east', 'south'][Math.floor(Math.random()*4)];
        console.log('Changed Direction Randomly:',this.direction);
        console.log('New Next Cell Pathability:', data.cell.neighbors[this.direction].pathable());
        console.log('\n\n');

      }
    } else {
      if(Math.abs(this.offsety) > 98) {
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