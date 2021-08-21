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

  handleAll(board) {
    while (this.queue.length) {
      this.handleEvent(board);
    }
    board.removeExpiredStates();
  }
}

module.exports = new GameEventHandler();