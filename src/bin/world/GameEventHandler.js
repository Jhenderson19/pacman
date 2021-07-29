class GameEventHandler {
  constructor() {
    this.queue = [];
  }

  registerEvent(name, payload) {
    this.queue.push({name, payload});
  }

  handleEvent() {
    var event = this.queue.shift();
    if (event.name === 'pelletCollect') {

    }
  }
}

module.exports = new GameEventHandler();