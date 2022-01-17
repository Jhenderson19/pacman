const Pellet = require('./Pellet');
let entID = 'item_powerpellet';

module.exports = class PowerPellet extends Pellet {

  static entID = entID;

  constructor(options) {
    super(options);
    this.entID = entID;

    this.duration = 8;
  }

  collect(eventHandler) {

    super.collect(eventHandler);

    eventHandler.registerEvent('PowerPelletCollect', (board) => {
        console.log('POWERPELLET COLLECTED! GET EM BOYS');
        board.ghosts.forEach(ghost => {
          if (ghost.alive) {
            ghost.frightenedImmune = false;
          }
        });
        board.addStateTemporary('ScaredGhosts', this.duration);
    });

  }

  prepDraw(canvas) {
    super.prepDraw(canvas);
    this._renderData.cObject.radius *= 4;
  }

  draw(data) {
    this._renderData.cObject.fill = data.frame % 20 > 10 ?  '#000' : '#' + this.colors;
  }
}