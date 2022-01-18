const GameState = require('./worldstates/GameState');

module.exports = class StateHandler{
  static stateDefinitions = [
    require('./worldstates/GameState'),
    require('./worldstates/PausedState'),
    require('./worldstates/PowerPelletActiveState')
  ]

  constructor() {
    this.gameStates = [];
    this.stateDefinitions = StateHandler.stateDefinitions;
    this.checkState = this.checkState.bind(this);
  }

  addState(stateStr = '', duration = 0) {
    let options = {};
    duration ? options.duration = duration : null;
    for (let state in this.stateDefinitions) {
      if(this.stateDefinitions[state].matchStateString(stateStr)) {
        let existingState = this.checkState(stateStr);
        if (existingState) {
          existingState.refresh(duration);
        } else {
          let newState = new this.stateDefinitions[state](options);
          this.gameStates.push(newState);
          (newState.onAdd().bind(this))();
        }
        return;
      }
    }
    throw `Tried to add invalid state ${stateStr}`;
  }

  removeState(stateStr) {
    for (let state in this.gameStates) {
      if(this.gameStates[state].matchStateString(stateStr)) {
        (this.gameStates[state].onRemove().bind(this))();
        delete this.gameStates[state];
      }
    }
  }

  toggleState(stateStr = '') {
    this.checkState(stateStr) ? this.removeState(stateStr) : this.addState(stateStr);
  }

  removeExpiredStates() {
    for(let state in this.gameStates) {
      this.gameStates[state].getIsExpired() ? this.removeState(this.gameStates[state].stateId) : null;
    }
  }

  /**
   *
   * @param {string} stateStr
   * @returns {?GameState}
   */
  checkState(stateStr = '') {
    for(let state in this.gameStates) {
      if(this.gameStates[state].stateId.toLowerCase() === stateStr.toLowerCase()) {
        return this.gameStates[state];
      }
    }
    return null;
  }

}