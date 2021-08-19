class EntityRegistry {
  constructor () {
    this.entityDefinitions = [];
  }
  register(classDef) {
    console.log(classDef);
    this.entityDefinitions.push(classDef);
  }
  getEnt(className = '') {
    for (let def in this.entityDefinitions) {
      if (this.entityDefinitions[def].name === className) {
        return className;
      }
    }
  }
}

module.exports = new EntityRegistry();