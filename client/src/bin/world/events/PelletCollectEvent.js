const GameEvent = require('./GameEvent');

module.exports = class PelletCollectEvent extends GameEvent {
  static eventId = 'PelletCollectEvent'

  constructor() {
    super();
  }

}