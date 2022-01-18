const Pathfinding = require('../../../AI/Pathfinding');
const Entity = require('../../entity');
const GameEventHandler = require('../../../world/GameEventHandler');

module.exports = class Ghost extends Entity {

  static entID = 'ghost_default';

  constructor(options) {
    super(options);

    /** @type {boolean} - True if an object can path through this entity */
    this.pathable = true;
    /** @type {number} - Speed of the ghost */
    this.speed = options.speed || 30;
    /** @type {number} - current multiplier of the speed of the ghost */
    this.speedMult = 1;
    /** @type {number} - speed multiplier to return to, when it is reset */
    this.defaultSpeedMult = 1;
    /** @type {string} - Color of the ghost! */
    this.colors = '1E1E1E';
    /** @type {string} - direction the ghost is currently travelling */
    this.direction = 'east';
    this.offsetx = -100;
    this.lastTurnLoc = {x: this.x, y: this.y};
    this.scatterHome = {x: this.x, y: this.y};
    this.defaultPathfinding = 'random';
    /** @type {boolean} - True if the ghost is currently immune to being frightened */
    this.frightenedImmune = false;
    /** @type {boolean} - True if the ghost is currently alive */
    this.alive = true;

    //Render Help
    this._renderData.pixelYOffset = this._renderData.posMult/2;
    this._renderData.pixelXOffset = this._renderData.posMult/2;
  }

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

  draw(data) {
    let pixeldata = this.getPixelData();
    this._renderData.cObject.x = pixeldata.x;
    this._renderData.cObject.y = pixeldata.y;
    if( data.checkState('PowerPelletActive')  && !this.frightenedImmune ) {
      this._renderData.cObject.fill = data.frame % 30 > 15 ? '#FFF' : '#00F';
    } else {
      this._renderData.cObject.fill = '#' + this.colors;
    }
  }

  _instantFree(x = 1, y = 1) {
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

  /**
   *
   * @param {GameEventHandler} eventHandler
   */
  killGhost(eventHandler) {
    if (!this.frightenedImmune) {
      window.pacmanConfig.logGhostDeaths ? console.log(this.entID + ' has been killed!') : null;
      this.frightenedImmune = true;
      this._instantFree();
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
