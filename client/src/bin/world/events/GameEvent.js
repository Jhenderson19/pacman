const StateHandler = require('../StateHandler');

module.exports = class GameEvent {

  static eventId = 'event';

  constructor() {
    /** @type {string} */
    this.eventId = this.constructor.eventId;
  }


  /**
   * @param {StateHandler} _stateHandler
   * @returns {void}
   */
  onFireEvent(_stateHandler) {
    window.pacmanConfig.logEventFires ? console.log(this.eventId, 'fired!') : null;
  }
}