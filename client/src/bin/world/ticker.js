class Ticker {
  constructor(fps = 60) {
    this.entList = [];
    this.tickInterval = Math.floor(1000 / fps);
    this.fps = fps;
    this.intervalDigit = 0;
    this.ticking = false;
  }
  setBoard(board) {
    this.board = board;
  }
  setEventHandler(eventHandler) {
    this.eventHandler = eventHandler;
  }
  setKeyHandler(keyHandler) {
    this.keyHandler = keyHandler;
  }
  setCanvas(canvas) {
    if (!this.board) { throw 'Register the board first!' }
    this.canvas = canvas;
    this.canvas.timeline.fps = this.fps;
    this.initDraws();
    canvas.setLoop(() => {
      if (this.board.checkState('Paused')) { return }
      this.handleTicks();
      this.handleCollides();
      this.handleDeletes();
      this.handleDraws();
      this.eventHandler.handleAll(this.board);
    })
  }
  register(obj) {
    this.entList.push(obj);
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
        checkState: this.board.checkState.bind(this.board)
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
        checkState: this.board.checkState.bind(this.board),
        pressedKeys: this.keyHandler.pressedKeys
      }

      entity.tick(data, this.eventHandler);
    });
  }
  handleDraws() {
    this.entList.forEach((entity) => {
      if (!entity.draw || !this.canvas) { return }
      (!entity._renderData.ready && entity.prepDraw) ? entity.prepDraw(this.canvas) : undefined; //Prepare the object to be drawn

      var data = {
        canvas: this.canvas,
        frame: this.canvas.timeline.currentFrame,
        cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : undefined,
        player: this.board.player,
        ghosts: this.board.ghosts,
        checkState: this.board.checkState.bind(this.board)
      }

      entity.draw(data);
    });
  }
  initDraws() {
    var initGroup = (regex) => {
      this.entList.forEach((entity) => {
        if (regex.test(entity.entID) && !entity._renderData.ready && entity.prepDraw) {
          entity.prepDraw(this.canvas);
        }
      })
    }
    var order = [
      /static/,
      /item/,
      /player/,
      /ghost/
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

module.exports = new Ticker();