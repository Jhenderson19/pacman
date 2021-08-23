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
  switch (direction) {
    case 'north':
      return 'south'
    case 'east':
      return 'west';
    case 'south':
      return 'north';
    case 'west':
      return 'east';
  }
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

    if (Math.abs(pathingObject.offsety) < pathingObject.speed && !pathables[pathingObject.direction]) {
      pathingObject.direction = pathingObject.direction === 'north' ? 'south' : 'north';
    }

    caluclateOffsets(pathingObject, pathables, false);
  }

  static aggressive(pathingObject, data) {
    let pathables = getPathables(data.cell);
    //Pathfinding.random(pathingObject, data);

    //Algo
    let navNode = data.cell.contains('ai_navnode');
    if(nearMid(pathingObject)) {
      if (navNode && movedSinceLastTurn(pathingObject)) {
        let target = {
          x: data.player.x,
          y: data.player.y
        }
        let distance = data.getPath(navNode, pathingObject.direction, target);
        pathingObject.direction = distance.direction;
        pathingObject.lastTurnLoc = {x: pathingObject.x, y: pathingObject.y };
      } else if (!pathables[pathingObject.direction]) {
        pathingObject.direction = getOpposite(pathingObject.direction);
      }
    }
    //End Algo


    caluclateOffsets(pathingObject, pathables);
  }
  static aimAhead(pathingObject, data) {
    let pathables = getPathables(data.cell);

    //Algo
    let navNode = data.cell.contains('ai_navnode');
    if(nearMid(pathingObject)) {
      if (navNode && movedSinceLastTurn(pathingObject)) {
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
        let path = data.getPath(navNode, pathingObject.direction, target);
        pathingObject.direction = path.direction;
        pathingObject.lastTurnLoc = {x: pathingObject.x, y: pathingObject.y };
      } else if (!pathables[pathingObject.direction]) {
        pathingObject.direction = getOpposite(pathingObject.direction);
      }
    }
    //End Algo

    caluclateOffsets(pathingObject, pathables);
  }
  static ambush(pathingObject, data) {
    //let pathables = getPathables(data.cell);
    //caluclateOffsets(pathingObject, pathables);
    //redirect ambush to random until I can implement it
    Pathfinding.random(pathingObject, data);
  }
  static shy(pathingObject, data) {
    let pathables = getPathables(data.cell);

    //Algo
    let navNode = data.cell.contains('ai_navnode');
    if(nearMid(pathingObject)) {
      if (navNode && movedSinceLastTurn(pathingObject)) {
        let target = {
          x: data.player.x,
          y: data.player.y
        }
        if (distance(pathingObject, data.player) <= 8) {
          console.log(pathingObject.entID + ": I'm scared!");
          target.x = 1;
          target.y = data.board.height - 2;
        }
        let path = data.getPath(navNode, pathingObject.direction, target);
        pathingObject.direction = path.direction;
        pathingObject.lastTurnLoc = {x: pathingObject.x, y: pathingObject.y };
      } else if (!pathables[pathingObject.direction]) {
        pathingObject.direction = getOpposite(pathingObject.direction);
      }
    }
    //End Algo

    caluclateOffsets(pathingObject, pathables);
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
}