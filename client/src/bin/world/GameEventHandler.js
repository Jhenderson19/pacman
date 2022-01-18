const GameEvent = require("./events/GameEvent");
const StateHandler = require("./StateHandler");

module.exports = class GameEventHandler {
  constructor() {
    /** @type {GameEvent[]} */
    this.queue = [];
  }

  /**
   *
   * @param {GameEvent} event
   */
  registerEvent(event) {
    this.queue.push(event);
  }


  /**
   *
   * @param {StateHandler} stateHander
   */
  handleEvent(stateHandler) {
    var event = this.queue.shift();
    event.onFireEvent(stateHandler);
  }

  /**
   *
   * @param {StateHandler} stateHander
   */
  handleAll(stateHander) {
    while (this.queue.length) {
      this.handleEvent(stateHander);
    }
    stateHander.removeExpiredStates();
  }
}