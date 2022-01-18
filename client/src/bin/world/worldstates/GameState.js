module.exports = class GameState {

  static stateId = 'gamestate';

  static matchStateString(str = '') {
    return this.stateId.toLowerCase() === str.toLowerCase();
  }

  constructor(options) {
    /** @type {string} */
    this.stateId = this.constructor.stateId;
    this.refreshable = false;
    this.setExpireTime(options.duration);
  }

  /**
   * Sets the expire time to duration seconds from now
   * @param {number} duration
   */
  setExpireTime(duration) {
    this.expireTime = duration ? (duration * 1000) + Date.now() : 0;
  }

  /**
   * Returns true if the state is expired
   * @returns {boolean}
   */
  getIsExpired() {
    if (this.expireTime === 0) {
      return false;
    } else {
      return Date.now() > this.expireTime;
    }
  }

  /**
   * Returns a function to be run bound to the statehandler when this state is added
   * @returns {Function} functionToRun
   */
  onAdd() {
    window.pacmanConfig.logStateChanges ? console.log(this.stateId, 'state added') : null;
    return () => {};
  }

  /**
   * Returns a function to be run bound to the statehandler when this state is removed
   * @returns {Function} functionToRun
   */
  onRemove() {
    window.pacmanConfig.logStateChanges ? console.log(this.stateId, 'state removed') : null;
    return () => {};
  }

  /**
   * returns true if statestring matches
   * @param {String} str
   * @returns {boolean} doesStateStrMatch
   */
  matchStateString(str = '') {
    return this.constructor.matchStateString(str);
  }

  /**
   * Refreshes the expire time for this state
   * @param {Number} duration
   * @returns {Boolean}
   */
  refresh(duration) {
    if(this.refreshable) {
      window.pacmanConfig.logStateChanges ? console.log(this.stateId, 'state refreshed') : null;
      this.setExpireTime(duration);
      return true;
    }
    return false;
  }
}