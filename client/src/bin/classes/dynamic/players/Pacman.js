const Entity = require('../../entity');
const Pathfinding = require('../../../AI/Pathfinding');
const GameEventHandler = require('../../../world/GameEventHandler');
const Ghost = require('../ghosts/Ghost');

module.exports = class Pacman extends Entity {

  static entID = 'player_pacman';

  constructor(options) {
    super(options);
    this.pathable = true;
    this.speed = options.speed || 30;
    this.speedMult = 1;
    this.colors = 'ff0';
    this.offsetx = -100;
    this.direction = 'none';
    this.lastTurnLoc = {x: this.x, y: this.y};
    this.defaultPathfinding = 'playerControlled';

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
  }

  tick(data) {
    Pathfinding[this.defaultPathfinding](this, data);
    this.moveCells(data.cell, data.board);
  }

  collide(data, eventHandler){
    data.cell.contents.forEach(entity => {
      if(data.checkState('PowerPelletActive')) {
        if(entity.entID.indexOf('ghost') !== -1) {
          /** @type {Ghost} */
          var ghost = entity;
          !ghost.frightenedImmune ? ghost.killGhost(eventHandler) : null;
        }
      }
      entity.collect ? entity.collect(eventHandler) : null;
    });
  }

  /**
   *
   * @param {GameEventHandler} eventHandler
   */
  kill(eventHandler) {
    this.x = 1;
    this.y = 1;
    window.pacmanConfig.logPlayerDeaths ? console.log('killed',this) : null;
  }
}