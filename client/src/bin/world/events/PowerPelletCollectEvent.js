const PelletCollectEvent = require('./PelletCollectEvent');
const StateHandler = require('../StateHandler');

module.exports = class PowerPelletCollectEvent extends PelletCollectEvent {

  static eventId = 'PowerPelletCollectEvent';

  constructor() {
    super();
  }

  /**
  * @param {StateHandler} stateHandler stateHandler
  * @returns {void}
  */
  onFireEvent(stateHandler) {
    super.onFireEvent(stateHandler);
    stateHandler.addState('PowerPelletActive', 8);
  }
}