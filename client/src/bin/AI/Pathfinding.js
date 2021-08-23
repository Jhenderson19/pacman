var getPathables = (cell) => {
  return {
    north: cell.neighbors.north.pathable(),
    south: cell.neighbors.south.pathable(),
    east: cell.neighbors.east.pathable(),
    west: cell.neighbors.west.pathable()
  }
}
var readyToTurn = (pathingObject, pathables) => {
  let numOfpaths = 0;
  for (let direction in pathables) {
    if (pathables[direction]) {
      numOfpaths++;
    }
  }
  let optionToTurn = numOfpaths > 2 && !(pathingObject.x === pathingObject.lastTurnLoc.x && pathingObject.y === pathingObject.lastTurnLoc.y);

  let nextCellNotPathable = !pathables[pathingObject.direction];
  let closeToMiddle = Math.max(Math.abs(pathingObject.offsetx), Math.abs(pathingObject.offsety)) < pathingObject.speed;
  return (nextCellNotPathable || optionToTurn || numOfpaths === 1) && closeToMiddle;
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

module.exports = class Pathfinding {
  //Pathfinding Modes
  static random(pathingObject, data) {
    let pathables = getPathables(data.cell);

    if (readyToTurn(pathingObject, pathables)) {
      let possibleDirections = [];
      for(let dir in pathables) {
        if (pathables[dir]) {
          possibleDirections.push(dir);
        }
      }
      if (possibleDirections.length === 1) {
        pathingObject.direction = possibleDirections[0];
        pathingObject.lastTurnLoc.x = pathingObject.x;
        pathingObject.lastTurnLoc.y = pathingObject.y;
        return;
      }

      possibleDirections.splice(possibleDirections.indexOf(getOpposite(pathingObject.direction)), 1);

      let nDir = Math.floor(Math.random() * possibleDirections.length);
      pathingObject.direction = possibleDirections[nDir];
      pathingObject.lastTurnLoc.x = pathingObject.x;
      pathingObject.lastTurnLoc.y = pathingObject.y;
      return;

    }

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
    //let pathables = getPathables(data.cell);
    // caluclateOffsets(pathingObject, pathables);
    Pathfinding.random(pathingObject, data);

  }
  static aimAhead(pathingObject, data) {
    let pathables = getPathables(data.cell);

    caluclateOffsets(pathingObject, pathables);
  }
  static ambush(pathingObject, data) {
    let pathables = getPathables(data.cell);

    caluclateOffsets(pathingObject, pathables);
  }
  static shy(pathingObject, data) {
    let pathables = getPathables(data.cell);

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

    caluclateOffsets(pathingObject, pathables, false);
  }
}