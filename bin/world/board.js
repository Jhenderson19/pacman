const Wall = require('../classes/static/Wall');
const Pellet = require('../classes/dynamic/items/Pellet');
const PowerPellet = require('../classes/dynamic/items/PowerPellet');
const Pacman = require('../classes/dynamic/players/Pacman');
const Ghost = require('../classes/dynamic/ghosts/Ghost');
const Warp = require('../classes/static/Warp');
const GhostGate = require('../classes/static/GhostGate');
const spawn = require('./spawner');
const Cell = require('./Cell');

class Board {
  constructor() {
    this.board = [[]];
    //w = wall
    //. = pellet
    //o = power pellet
    //_ = nothing
    //P = Pacman spawn point
    //b = Blinky
    //i = Inky
    //p = Pinky
    //c = clyde
    //T = warp
    //- = ghostGate
    this.layout = `wwwwwwwwwwwwwwwwwwwwwwwwwwww
      w............ww............w
      w.wwww.wwwww.ww.wwwww.wwww.w
      wowwww.wwwww.ww.wwwww.wwwwow
      w.wwww.wwwww.ww.wwwww.wwww.w
      w..........................w
      w.wwww.ww.wwwwwwww.ww.wwww.w
      w.wwww.ww.wwwwwwww.ww.wwww.w
      w......ww....ww....ww......w
      wwwwww.wwwww_ww_wwwww.wwwwww
      _____w.wwwww_ww_wwwww.w_____
      _____w.ww_____b____ww.w_____
      _____w.ww_www--www_ww.w_____
      wwwwww.ww_w______w_ww.wwwwww
      T_____.___w_i_p_cw___._____T
      wwwwww.ww_w______w_ww.wwwwww
      _____w.ww_wwwwwwww_ww.w_____
      _____W.ww__________ww.w_____
      _____w.ww_wwwwwwww_ww.w_____
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
      wwwwwwwwwwwwwwwwwwwwwwwwwwww`.replace(/ /g, '');
    this.layoutArr = this.layout.split('\n');

    this.board = this.layoutArr.map((row) => {
      console.log(row);
      return row.split('').map((col) => {
        return new Cell();
      })
    });

    for(let y = 0; y < this.board.length; y++) {
      for(let x = 0; x < this.board[0].length; x++) {
        switch (this.layoutArr[y][x]){
          case 'w':
            this.board[y][x].insert(spawn(Wall, {x, y}));
            break;
          case '.':
            this.board[y][x].insert(spawn(Pellet, {x, y}));
            break;
          case 'o':
            this.board[y][x].insert(spawn(PowerPellet, {x, y}));
        }
      }
    }
  }
}

new Board();

module.exports = Board;