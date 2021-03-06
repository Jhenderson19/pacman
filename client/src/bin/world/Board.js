//Entities
const EntityRegistry = require('./EntityRegistry');

//World
const Cell = require('./Cell');
const NavMesh = require('../AI/NavMesh');

module.exports = class Board {

  constructor(layout) {
    this.board = [[]];
    this.player;
    this.ghosts = [];
    this.gameStates = [
      'playing'
    ]
    this.stateTimers = [];
    //w = wall
    //. = pellet
    //o = power pellet
    //_ = nothing
    //P = Pacman spawn point
    //b = Blinky
    //i = Inky
    //p = Pinky
    //c = clyde
    //- = ghostGate
    if(!layout) {
      layout = `wwwwwwwwwwwwwwwwwwwwwwwwwwww
      w............ww............w
      w.wwww.wwwww.ww.wwwww.wwww.w
      wowwww.wwwww.ww.wwwww.wwwwow
      w.wwww.wwwww.ww.wwwww.wwww.w
      w..........................w
      w.wwww.ww.wwwwwwww.ww.wwww.w
      w.wwww.ww.wwwwwwww.ww.wwww.w
      w......ww....ww....ww......w
      wwwwww.wwwww_ww_wwwww.wwwwww
      sssssw.wwwww_ww_wwwww.wsssss
      sssssw.ww_____b____ww.wsssss
      sssssw.ww_www--www_ww.wsssss
      wwwwww.ww_w______w_ww.wwwwww
      ______.___w_i_p_cw___.______
      wwwwww.ww_w______w_ww.wwwwww
      sssssw.ww_wwwwwwww_ww.wsssss
      sssssw.ww__________ww.wsssss
      sssssw.ww_wwwwwwww_ww.wsssss
      wwwwww.ww_wwwwwwww_ww.wwwwww
      w............ww............w
      w.wwww.wwwww.ww.wwwww.wwww.w
      w.wwww.wwwww.ww.wwwww.wwww.w
      wo..ww......._P.......ww..ow
      www.ww.ww.wwwwwwww.ww.ww.www
      www.ww.ww.wwwwwwww.ww.ww.www
      w......ww....ww....ww......w
      w.wwwwwwwwww.ww.wwwwwwwwww.w
      w.wwwwwwwwww.ww.wwwwwwwwww.w
      w..........................w
      wwwwwwwwwwwwwwwwwwwwwwwwwwww`
    }
    layout = layout.replace(/ /g, '');
    if (!/^[ws\.o_Pipbc\n-]+$/.test(layout)) {
      throw 'INVALID CHARACTER IN BOARD LAYOUT STRING'
    }
    this.layoutArr = layout.split('\n');

    this.board = this.layoutArr.map((row) => {
      return row.split('').map((col) => {
        return new Cell();
      })
    });
    this.height = this.board.length;
    this.width = this.board[0].length;
  }

  setTicker(ticker) {
    this.ticker = ticker;
  }

  populate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.getCell(x, y)._setNeighbors(this.getCellNeighbors(x, y));
        let g = '';
        switch (this.layoutArr[y][x]) {
          case 'w':
            this.spawn('static_wall', { x, y });
            break;
          case 's':
            this.spawn('static_wall', { x, y, hidden: true});
            break;
          case '.':
            this.spawn('item_pellet', { x, y });
            break;
          case 'o':
            this.spawn('item_powerpellet', { x, y });
            break;
          case '-':
            this.ghostExit = {x, y: y - 1};
            this.spawn('static_ghostgate', { x, y });
            break;
          case 'P':
            this.player = this.spawn('player_pacman', { x, y });
            break;
          case 'i':
            this.ghosts.push(this.spawn('ghost_inky', { x, y }));
            break;
          case 'p':
            this.ghosts.push(this.spawn('ghost_pinky', { x, y }));
            break;
          case 'b':
            this.ghosts.push(this.spawn('ghost_blinky', { x, y }));
            break;
          case 'c':
            this.ghosts.push(this.spawn('ghost_clyde', { x, y }));
            break;
        }
      }
    }
    this.nav_generate();
    this.ghosts[0].setScatterHome({x: this.width-1, y:0});
    this.ghosts[1].setScatterHome({x: this.width-1, y:this.height - 1});
    this.ghosts[2].setScatterHome({x: 0, y: 0});
    this.ghosts[3].setScatterHome({x: 0, y:this.height - 1});
  }

  consoleDraw() {
    for (let i = 0; i < this.height; i++) {
      var rowstr = ''
      for (let j = 0; j < this.width; j++) {
        this.board[i][j].contains('static_wall') ? rowstr += '%%' :
          this.board[i][j].contains('static_ghostgate') ? rowstr += '--' :
            this.board[i][j].contains('item_pellet') ? rowstr += ' ??' :
              this.board[i][j].contains('item_powerpellet') ? rowstr += ' ???' :
                this.board[i][j].contains('player_pacman') ? rowstr += '????' :
                  this.board[i][j].contains(/ghost/) ? rowstr += '????' :
                    rowstr += '  ';
      }
      console.log(rowstr);
    }
    console.log();
    console.log('player: ');
    console.log(this.player);
    console.log('ghosts:');
    console.log(this.ghosts);
  }

  entListVerbose() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        console.log(this.board[i][j].listTypes());
      }
    }
  }

  getCell(x, y) {
    return this.board[y][x];
  }

  getCellNeighbors(x, y) {
    var results = {};

    let loopify = (x, y) => {
      if (x === -1) {
        x = this.width - 1;
      }
      if (x === this.width) {
        x = 0;
      }
      if (y === -1) {
        y = this.height - 1;
      }
      if (y === this.height) {
        y = 0;
      }
      return this.getCell(x, y);
    }
    results.north = loopify(x, y - 1);
    results.south = loopify(x, y + 1);
    results.east = loopify(x + 1, y);
    results.west = loopify(x - 1, y);

    return results;
  }

  toggleState(stateStr = '') {
    if(this.checkState(stateStr)) {
      this.removeState(stateStr);
      return false;
    } else {
      this.addState(stateStr);
      return true;
    }
  }

  addStateTemporary(stateStr = '', duration = 8){
    this.addState(stateStr.toLowerCase());
    this.stateTimers[stateStr.toLowerCase()] = Date.now() + duration * 1000;
  }

  removeExpiredStates() {
    for(let state in this.stateTimers) {
      if(this.stateTimers[state] < Date.now()) {
        console.log('removing state:', state);
        this.removeState(state);
      }
    }
  }

  addState(stateStr = '') {
    if(!this.checkState(stateStr)) {
      this.gameStates.push(stateStr.toLowerCase());
      if(stateStr.toLowerCase() === 'paused') {
        let pauseTime = Date.now()
        for(let state in this.stateTimers) {
          this.stateTimers[state] -= pauseTime;
        }
      }
      return true;
    }
    return false;
  }

  checkState(stateStr = '') {
    return this.gameStates.indexOf(stateStr.toLowerCase()) > -1;
  }

  removeState(stateStr) {
    while(this.gameStates.indexOf(stateStr.toLowerCase()) > -1) {
      this.gameStates.splice(this.gameStates.indexOf(stateStr.toLowerCase()),1);
      delete this.stateTimers[stateStr.toLowerCase()];
      if(stateStr.toLowerCase() === 'paused') {
        let unpauseTime = Date.now();
        for(let state in this.stateTimers) {
          this.stateTimers[state] += unpauseTime;
        }
      }
    }
  }

  spawn(entityID, location) {
    let obj;
    if(typeof entityID === 'string') {
      obj = this.ticker.spawn(EntityRegistry.getEntity(entityID), location)
    } else {
      obj = this.ticker.spawn(entityID, location);
    }

    this.getCell(location.x, location.y).insert(obj);
    return obj;
  }

  nav_generate() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.getCell(i, j).pathable()) {
          this.navMesh = new NavMesh(this);
          this.navMesh.connectAll();
          return;
        }
      }
    }
  }

  async dev_freeGhosts() {
    for(let g in this.ghosts) {
      this.ghosts[g].instantFree(this.ghostExit.x, this.ghostExit.y);
      await new Promise((resolve) => {
        setTimeout(resolve, 750);
      })
    }
  }

}
