const Cell = require('../world/Cell');
const helpers = require('./helpers');

module.exports = class Pathfinding {
  //Pathfinding Modes
  static random(pathingObject, data) {
    let pathables = helpers.getPathables(data.cell);

    //Algo
    let navNode = data.cell.contains('ai_navnode');
    if(helpers.getIsNearMiddleOfCell(pathingObject)) {
      if (navNode && helpers.getHasMovedSinceLastTurn(pathingObject)) {
        let poss = Object.keys(navNode.connectedNodes);
        poss.splice(poss.indexOf(helpers.opposite[pathingObject.direction]), 1);
        pathingObject.direction = poss[Math.floor(Math.random() * poss.length)];
        pathingObject.lastTurnLoc = {x: pathingObject.x, y: pathingObject.y };
      } else if (!pathables[pathingObject.direction]) {
        pathingObject.direction = helpers.opposite[pathingObject.direction];
      }
    }
    //End Algo

    helpers.calculateOffsets(pathingObject, pathables);
  }

  static ghostHouse(pathingObject, data) {
    let pathables = {
      north: data.cell.neighbors.north.pathable(),
      south: data.cell.neighbors.south.pathable(),
      west: false,
      east: false
    }

    //Algo
    if (Math.abs(pathingObject.offsety) < pathingObject.speed && !pathables[pathingObject.direction]) {
      pathingObject.direction = pathingObject.direction === 'north' ? 'south' : 'north';
    }
    //End Algo

    helpers.calculateOffsets(pathingObject, pathables, false);
  }

  static aggressive(pathingObject, data) {
    let getTarget = (pathingObject, data) => {
      return data.player;
    }

    Pathfinding.moveToTarget(pathingObject, data, getTarget);
  }

  static aimAhead(pathingObject, data) {
    let getTarget = (pathingObject, data) => {
      let target = {
        x: data.player.x,
        y: data.player.y
      }
      switch(data.player.direction) {
        case 'north':
          target.y -= 4;
          break;
        case 'south':
          target.y += 4;
          break;
        case 'east':
          target.x += 4;
          break;
        case 'west':
          target.x -= 4;
          break;
      }
      return target;
    }

    Pathfinding.moveToTarget(pathingObject, data, getTarget);
  }

  static ambush(pathingObject, data) {

    let getTarget = (pathingObject, data) => {
      let tGhost;
      let modPlayer = {
        x: data.player.x,
        y: data.player.y
      }

      switch(data.player.direction) {
        case 'north':
          modPlayer.y -= 2;
          break;
        case 'south':
          modPlayer.y += 2;
          break;
        case 'east':
          modPlayer.x += 2;
          break;
        case 'west':
          modPlayer.x -= 2;
          break;
      }

      data.ghosts.forEach((ghost) =>{
        ghost.defaultPathfinding === 'aggressive' ? tGhost = ghost : null;
      });

      if(tGhost === undefined) {
        throw 'No aggressive Ghost found for ambush pathfinding!';
      }

      return {
        x: 2 * (modPlayer.x - tGhost.x) + tGhost.x,
        y: 2 * (modPlayer.y - tGhost.y) + tGhost.y
      }
    }

    Pathfinding.moveToTarget(pathingObject, data, getTarget);
  }

  static shy(pathingObject, data) {
    let getTarget = (pathingObject, data) => {
      if(helpers.distance(pathingObject, data.player) >= 8) {
        return data.player;
      } else {
        return pathingObject.scatterHome;
      }
    }

    Pathfinding.moveToTarget(pathingObject, data, getTarget);
  }

  static scatter(pathingObject, data) {
    Pathfinding.moveToTarget(pathingObject, data, (pathingObject, data) => {
      return pathingObject.scatterHome;
    });
  }

  static scared(pathingObject, data) {
    let pathables = helpers.getPathables(data.cell);

    helpers.calculateOffsets(pathingObject, pathables);
  }

  static playerControlled(pathingObject, data) {
    let pathables = helpers.getPathables(data.cell);

    if (data.pressedKeys.KeyW && Math.abs(pathingObject.offsetx) < pathingObject.speed && pathables.north) {
      pathingObject.direction = 'north';
    }
    if (data.pressedKeys.KeyD && Math.abs(pathingObject.offsety) < pathingObject.speed && pathables.east) {
      pathingObject.direction = 'east';
    }
    if (data.pressedKeys.KeyS && Math.abs(pathingObject.offsetx) < pathingObject.speed && pathables.south) {
      pathingObject.direction = 'south';
    }
    if (data.pressedKeys.KeyA && Math.abs(pathingObject.offsety) < pathingObject.speed && pathables.west) {
      pathingObject.direction = 'west';
    }

    helpers.calculateOffsets(pathingObject, pathables);
  }

  /**
   *
   * @param {Entity} pathingObject
   * @param {{cell: Cell}} data
   * @param {function} getTargetAlgo
   */
  static moveToTarget(pathingObject, data, getTargetAlgo) {
    let pathables = helpers.getPathables(data.cell);

    //Algo
    let navNode = data.cell.contains('ai_navnode')[0];
    if(helpers.getIsNearMiddleOfCell(pathingObject)) {
      if (navNode && helpers.getHasMovedSinceLastTurn(pathingObject)) {
        let distance = data.getPath(navNode, pathingObject.direction, getTargetAlgo(pathingObject, data));
        pathingObject.direction = distance.direction;
        pathingObject.lastTurnLoc = {x: pathingObject.x, y: pathingObject.y };
      } else if (!pathables[pathingObject.direction]) {
        pathingObject.direction = helpers.opposite[pathingObject.direction];
      }
    }
    //End Algo

    helpers.calculateOffsets(pathingObject, pathables);
  }
}