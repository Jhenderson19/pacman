class EntityRegistry {
  constructor () {
    this.entityDefinitions = [];
    let cur = undefined;
    let p = () => {this.entityDefinitions.push({def: cur, entID: new cur({id: 0}).entID})};
    cur = require('../classes/entity'); p();
    cur = require('../classes/static/Wall'); p();
    cur = require('../classes/static/GhostGate'); p();
    cur = require('../classes/dynamic/players/Pacman'); p();
    cur = require('../classes/dynamic/players/MsPacman'); p();
    cur = require('../classes/dynamic/items/Pellet'); p();
    cur = require('../classes/dynamic/items/PowerPellet'); p();
    cur = require('../classes/dynamic/ghosts/Inky'); p();
    cur = require('../classes/dynamic/ghosts/Pinky'); p();
    cur = require('../classes/dynamic/ghosts/Blinky'); p();
    cur = require('../classes/dynamic/ghosts/Clyde'); p();
  }
  getEntity(entityID) {
    for (let entry in this.entityDefinitions) {
      if (this.entityDefinitions[entry].entID === entityID) {
        return this.entityDefinitions[entry].def;
      }
    }
    throw `Unable to find ${className} in entity registry!`;
  }
}

module.exports = new EntityRegistry();