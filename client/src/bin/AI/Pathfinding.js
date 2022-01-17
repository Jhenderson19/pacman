//Helper Functions
var getPathables = (cell) => {
  return {
    north: cell.neighbors.north.pathable(),
    south: cell.neighbors.south.pathable(),
    east: cell.neighbors.east.pathable(),
    west: cell.neighbors.west.pathable()
  }
}

var movedSinceLastTurn = (pathingObject) => {
  return pathingObject.x !== pathingObject.lastTurnLoc.x || pathingObject.y !== pathingObject.lastTurnLoc.y;
}

var getOpposite = (direction) => {
  var opposites = {
    north: 'south',
    east: 'west',
    south: 'north',
    west: 'east'
  }
  return opposites[direction];
}

var caluclateOffsets = (object, pathables, gridlocked = true) => {
  switch(object.direction) {
    case 'north':
      if (gridlocked) {
        object.offsetx = 0;
      }
      object.offsety -= object.speed * object.speedMult;
      if(!pathables.north && object.offsety < 0) {
        object.offsety = 0;
      }
      break;
    case 'east':
      if (gridlocked) {
        object.offsety = 0;
      }
      object.offsetx += object.speed * object.speedMult;
      if(!pathables.east && object.offsetx > 0) {
        object.offsetx = 0;
      }
      break;
    case 'south':
      if (gridlocked) {
        object.offsetx = 0;
      }
      object.offsety += object.speed * object.speedMult;
      if(!pathables.south && object.offsety > 0 ) {
        object.offsety = 0;
      }
      break;
    case 'west':
      if (gridlocked) {
        object.offsety = 0;
      }
      object.offsetx -= object.speed * object.speedMult;
      if(!pathables.west && object.offsetx < 0) {
        object.offsetx = 0;
      }
      break;
  }
}

var nearMid = (pathingObject) => {
  return Math.max(Math.abs(pathingObject.offsetx), Math.abs(pathingObject.offsety)) < pathingObject.speed;
}

var distance = (a, b) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

module.exports = class Pathfinding {
  //Pathfinding Modes
  static random(pathingObject, data) {
    let pathables = getPathables(data.cell);

    //Algo
    let navNode = data.cell.contains('ai_navnode');
    if(nearMid(pathingObject)) {
      if (navNode && movedSinceLastTurn(pathingObject)) {
        let poss = Object.keys(navNode.connectedNodes);
        poss.splice(poss.indexOf(getOpposite(pathingObject.direction)), 1);
        pathingObject.direction = poss[Math.floor(Math.random() * poss.length)];
        pathingObject.lastTurnLoc = {x: pathingObject.x, y: pathingObject.y };
      } else if (!pathables[pathingObject.direction]) {
        pathingObject.direction = getOpposite(pathingObject.direction);
      }
    }
    //End Algo

    caluclateOffsets(pathingObject, pathables);
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

    caluclateOffsets(pathingObject, pathables, false);
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
      if(distance(pathingObject, data.player) >= 8) {
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
    let pathables = getPathables(data.cell);

    caluclateOffsets(pathingObject, pathables);
  }

  static playerControlled(pathingObject, data) {
    let pathables = getPathables(data.cell);

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

    caluclateOffsets(pathingObject, pathables);
  }

  static moveToTarget(pathingObject, data, getTargetAlgo) {
    let pathables = getPathables(data.cell);

    //Algo
    let navNode = data.cell.contains('ai_navnode');
    if(nearMid(pathingObject)) {
      if (navNode && movedSinceLastTurn(pathingObject)) {
        let distance = data.getPath(navNode, pathingObject.direction, getTargetAlgo(pathingObject, data));
        pathingObject.direction = distance.direction;
        pathingObject.lastTurnLoc = {x: pathingObject.x, y: pathingObject.y };
      } else if (!pathables[pathingObject.direction]) {
        pathingObject.direction = getOpposite(pathingObject.direction);
      }
    }
    //End Algo

    caluclateOffsets(pathingObject, pathables);
  }
}