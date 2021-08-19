class EntityRegistry {
  constructor () {
    this.entityDefinitions = [
      //classes
      require('../classes/entity'),
        //static
        require('../classes/static/Wall'),
        require('../classes/static/GhostGate'),

        //dynamic
          //players
          require('../classes/dynamic/players/Pacman'),
          require('../classes/dynamic/players/MsPacman'),
          //items
          require('../classes/dynamic/items/Pellet'),
          require('../classes/dynamic/items/PowerPellet'),
            //fruit
            //powerups
          //ghosts
          require('../classes/dynamic/ghosts/Inky'),
          require('../classes/dynamic/ghosts/Pinky'),
          require('../classes/dynamic/ghosts/Blinky'),
          require('../classes/dynamic/ghosts/Clyde'),
            //custom
    ];
  }
  getEntity(className = '') {
    for (let def in this.entityDefinitions) {
      if (this.entityDefinitions[def].name === className) {
        return this.entityDefinitions[def];
      }
    }
    throw `Unable to find ${className} in entity registry!`;
  }
}

module.exports = new EntityRegistry();