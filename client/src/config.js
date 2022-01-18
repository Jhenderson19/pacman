
/**
 * @namespace
 * @property {number} defaultTileSize - default size of tiles in the board
 * @property {boolean} renderNavNodes - Should render NavNodes?
 * @property {boolean} logKeyPresses - Should log keypresses to console?
 * @property {boolean} logGhostDeaths - Should log ghost deaths to console?
 * @property {boolean} logPlayerDeaths - Should log player deaths to console?
 * @property {boolean} logEventFires - Should log event firings to console?
 * @property {boolean} logStateChanges - Should I log changes to gamestate?
 */
var pacmanConfig = {
  //regular config
  defaultTileSize: 16, //

  //devops
  renderNavNodes: true,
  logKeyPresses: false,
  logGhostDeaths: true,
  logPlayerDeaths: true,
  logEventFires: true,
  logStateChanges: true
}
window.pacmanConfig = pacmanConfig;