class GameEventHandler {
  constructor() {
    this.queue = [];
  }

  registerEvent(name, payload) {
    this.queue.push({name, payload});
  }

  handleEvent(board) {
    var event = this.queue.shift();
    event.payload(board);
  }

  handleAll(board, fps) {
    while (this.queue.length) {
      this.handleEvent(board);
    }
    board.tickTimers(fps);
  }
}

module.exports = new GameEventHandler();