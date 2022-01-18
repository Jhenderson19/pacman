const Entity = require('../classes/entity');

module.exports = class EntityRegistry {
  static entityDefinitions = [
    require('../classes/entity'),
    require('../classes/static/Wall'),
    require('../classes/static/GhostGate'),
    require('../classes/dynamic/players/Pacman'),
    require('../classes/dynamic/players/MsPacman'),
    require('../classes/dynamic/items/Pellet'),
    require('../classes/dynamic/items/PowerPellet'),
    require('../classes/dynamic/ghosts/Inky'),
    require('../classes/dynamic/ghosts/Pinky'),
    require('../classes/dynamic/ghosts/Blinky'),
    require('../classes/dynamic/ghosts/Clyde')
  ];

  /**
   *
   * @param {string} entityID
   * @throws Will throw an error if an entity cannot be found
   * @returns {typeof Entity}
   */
  static getEntity(entityID) {
    for (let entry in this.entityDefinitions) {
      if (this.entityDefinitions[entry].entID === entityID) {
        return this.entityDefinitions[entry];
      }
    }
    throw `Unable to find ${entityID} in entity registry!`;
  }
}
