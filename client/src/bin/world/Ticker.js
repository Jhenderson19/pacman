const Pacman = require('../classes/dynamic/players/Pacman');
const Entity = require('../classes/entity');
const Cell = require('./Cell');
const GameEventHandler = require('./GameEventHandler');
const KeyHandler = require('./KeyHandler');
const StateHandler = require('./StateHandler');

module.exports = class Ticker {
  constructor(fps = 60) {
    /** @type {Entity[]} list of entities tracked by this ticker*/
    this.entList = [];

    /** @type {number} delay in ms between frames*/
    this.tickInterval = Math.floor(1000 / fps);

    /** @type {number} - Goal FPS of this ticker*/
    this.fps = fps;

    /** @type {Number} - Not sure what this does, for now 😅*/
    this.intervalDigit = 0;

    /** @type {Boolean} - Whether this ticker is currently ticking */
    this.ticking = false;

    /** @type {Number} - the id of the next entity that will be spawned */
    this.idIndex = 0;
  }

  setBoard(board) {
    this.board = board;
  }

  /**
   *
   * @param {GameEventHandler} eventHandler
   */
  setEventHandler(eventHandler) {
    this.eventHandler = eventHandler;
  }

  /**
   *
   * @param {KeyHandler} keyHandler
   */
  setKeyHandler(keyHandler) {
    this.keyHandler = keyHandler;
  }

  /**
   *
   * @param {StateHandler} stateHandler
   */
  setStateHandler(stateHandler) {
    this.stateHandler = stateHandler;
  }

  /**
   *
   * @param {OCanvas} canvas
   */
  setCanvas(canvas) {
    if (!this.board) { throw 'Register the board first!' }
    this.canvas = canvas;
    this.canvas.timeline.fps = this.fps;
    this.initDraws();
    canvas.setLoop(() => {
      if (this.stateHandler.checkState('Paused')) { return }
      this.handleTicks();
      this.handleCollides();
      this.handleDeletes();
      this.handleDraws();
      this.eventHandler.handleAll(this.stateHandler);
    })
  }

  /**
   *
   * @param {typeof Entity} spawnTarget
   * @param {*} options
   * @returns {Entity}
   */
  spawn(spawnTarget, options) {
    var x = new spawnTarget({...options, id: this.idIndex});
    if (!x.entID) {
      throw `Object with ID ${id} spawned without entID! ${spawnTarget.entID}`;
    }
    this.idIndex++;
    this.entList.push(x);
    return x;
  }

  list() {
    return this.entList;
  }

  handleDeletes() {
    this.entList.forEach((entity, index) => {
      var data = {
        frame: this.canvas.timeline.currentFrame,
        cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : undefined,
        player: this.board.player,
        ghosts: this.board.ghosts
      }
      if (entity.markedForDelete) {
        this.entList.splice(index, 1);
        data.cell.remove(entity);
      }
    })
  }

  handleCollides() {
    this.entList.forEach((entity) => {
      if (!entity.collide) { return }

      var data = {
        frame: this.canvas.timeline.currentFrame,
        cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : undefined,
        player: this.board.player,
        ghosts: this.board.ghosts,
        checkState: this.stateHandler.checkState
      }

      entity.collide(data, this.eventHandler);
    });
  }

  handleTicks() {
    this.entList.forEach((entity) => {
      if (!entity.tick) { return }

      var data = {
        frame: this.canvas.timeline.currentFrame,
        cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : undefined,
        player: this.board.player,
        ghosts: this.board.ghosts,
        board: { width: this.board.width, height: this.board.height, getCell: this.board.getCell.bind(this.board) },
        pressedKeys: this.keyHandler.pressedKeys,
        getPath: this.board.navMesh.getPath.bind(this.board.navMesh),
        checkState: this.stateHandler.checkState,
      }

      entity.tick(data, this.eventHandler);
    });
  }

  handleDraws() {
    this.entList.forEach((entity) => {
      if (!this.canvas) { return }

      !entity._renderData.ready ? entity.prepDraw(this.canvas) : undefined; //Prepare the object to be drawn if it is not ready

      var data = {
        canvas: this.canvas,
        /** @type {number} */
        frame: this.canvas.timeline.currentFrame,
        /** @type {?Cell} */
        cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : null,
        player: this.board.player,
        ghosts: this.board.ghosts,
        checkState: this.stateHandler.checkState,
      }

      entity.draw(data);
    });
  }

  /**
   * runs prepdraw function on all entities that have it, in a specific order
   */
  initDraws() {

    var initGroup = (regex) => {
      this.entList.forEach((entity) => {
        if (regex.test(entity.entID) && !entity._renderData.ready) {
          entity.prepDraw(this.canvas);
        }
      })
    }

    var order = [
      /static/,
      /item/,
      /player/,
      /ghost/,
      /ai/
    ]

    order.forEach(initGroup);
  }

  startTick() {
    if (!this.ticking) {
      console.log('Starting Ticking!');
      this.canvas.timeline.start();
      this.ticking = true;
    }
  }

  stopTick() {
    if (this.ticking) {
      console.log('Stopping Ticking!');
      this.canvas.timeline.stop();
      this.ticking = false;
    }
  }

}