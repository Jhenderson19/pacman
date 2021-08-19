class Ticker {
  constructor(fps = 30) {
    this.entList = [];
    this.tickInterval = Math.floor(1000 / fps);
    this.fps;
    this.intervalDigit = 0;
    this.ticking = false;
  }
  setCanvas(canvas) {
    this.canvas = canvas;
    this.canvas.timeline.fps = this.fps;
    canvas.setLoop(() => {
      if(window.pause) { return }
      //Handle collisions
      this.entList.forEach((entity) => {
        if (!entity.collide) { return }

        var data = {
          frame: this.canvas.timeline.currentFrame,
          cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : undefined,
          player: this.board.player,
          ghosts: this.board.ghosts
        }

        entity.collide(data);
      });
      //Handle ticks
      this.entList.forEach((entity) => {
        if (!entity.tick) { return }

        var data = {
          frame: this.canvas.timeline.currentFrame,
          cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : undefined,
          player: this.board.player,
          ghosts: this.board.ghosts,
          board: {width: this.board.width, height: this.board.height, getCell: this.board.getCell.bind(this.board)}
        }

        entity.tick(data);
      });
      //Handle Render
      this.entList.forEach((entity) => {
        if (!entity.draw || !this.canvas) { return }
        (!entity._renderData.ready && entity.prepDraw) ? entity.prepDraw(this.canvas) : undefined; //Prepare the object to be drawn

        var data = {
          canvas: this.canvas,
          frame: this.canvas.timeline.currentFrame,
          cell: entity.x !== undefined && entity.y !== undefined && this.board ? this.board.getCell(entity.x, entity.y) : undefined,
          player: this.board.player,
          ghosts: this.board.ghosts
        }

        entity.draw(data);
      });
    })
  }
  register(obj) {
    if (obj.constructor.name.includes('Board')) {
      this.board = obj;
    } else {
      this.entList.push(obj);
    }
  }
  list() {
    return this.entList;
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