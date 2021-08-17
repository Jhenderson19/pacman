class Ticker {
  constructor(canvas) {
    this.entList = [];
    this.frame = 0;
    this.tickInterval = Math.floor(1000 / 16);
    this.intervalDigit = 0;
    this.ticking = false;
  }
  setCanvas(canvas) {
    this.canvas = canvas;
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
  tick() {
    //Handle Collisions
    this.entList.forEach((entity) => {
      if (!entity.collide) { return }
      var cell = entity.x && entity.y && this.board ? this.board.getCell(entity.x, entity.y) : undefined;
      entity.collide(this.frame, cell, this.board.player, this.board.ghosts);
    });
    //Handle ticks
    this.entList.forEach((entity) => {
      if (!entity.tick) { return }
      var cell = entity.x && entity.y && this.board ? this.board.getCell(entity.x, entity.y) : undefined;
      entity.tick(this.frame, cell, this.board.player, this.board.ghosts);
    });
    //Handle Render
    this.entList.forEach((entity) => {
      if (!entity.draw || !this.canvas) { return }
      var cell = entity.x && entity.y && this.board ? this.board.getCell(entity.x, entity.y) : undefined;
      !entity._renderData.ready && entity.prepDraw ? entity.prepDraw(this.canvas) : undefined;
      entity.draw(this.canvas, this.frame, cell, this.board.player, this.board.ghosts);
    });
    this.frame++;
  }
  startTick() {
    if (!this.ticking) {
      this.intervalDigit = setInterval(this.tick.bind(this), this.tickInterval);
      this.ticking = true;
    }
  }
  stopTick() {
    if (this.ticking) {
      clearInterval(this.intervalDigit);
      this.ticking = false;
    }
  }
}

module.exports = new Ticker();