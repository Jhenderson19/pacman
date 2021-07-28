const Wall = require('../classes/static/Wall');
const Pellet = require('../classes/dynamic/items/Pellet');
const PowerPellet = require('../classes/dynamic/items/PowerPellet');
const Pacman = require('../classes/dynamic/players/Pacman');
const Ghost = require('../classes/dynamic/ghosts/Ghost');
const Inky = require('../classes/dynamic/ghosts/Inky');
const Pinky = require('../classes/dynamic/ghosts/Pinky');
const Blinky = require('../classes/dynamic/ghosts/Blinky');
const Clyde = require('../classes/dynamic/ghosts/Clyde');

const GhostGate = require('../classes/static/GhostGate');
const spawn = require('./spawner');
const Cell = require('./Cell');

class Board {
  constructor() {
    this.board = [[]];
    this.player;
    this.ghosts = [];
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
      ______.___w_i_p_cw___.______
      wwwwww.ww_w______w_ww.wwwwww
      _____w.ww_wwwwwwww_ww.w_____
      _____w.ww__________ww.w_____
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
    if(!/^[w\.o_Pipbc\n-]+$/.test(this.layout)) {
      throw 'INVALID CHARACTER IN BOARD LAYOUT STRING'
    }
    this.layoutArr = this.layout.split('\n');

    this.board = this.layoutArr.map((row) => {
      return row.split('').map((col) => {
        return new Cell();
      })
    });
    this.height = this.board.length;
    this.width = this.board[0].length;

    for(let y = 0; y < this.board.length; y++) {
      for(let x = 0; x < this.board[0].length; x++) {
        let g = '';
        switch (this.layoutArr[y][x]){
          case 'w':
            this.board[y][x].insert(spawn(Wall, {x, y}));
            break;
          case '.':
            this.board[y][x].insert(spawn(Pellet, {x, y}));
            break;
          case 'o':
            this.board[y][x].insert(spawn(PowerPellet, {x, y}));
            break;
          case '-':
            this.board[y][x].insert(spawn(GhostGate, {x, y}));
            break;
          case 'P':
            this.player = spawn(Pacman, {x, y});
            this.board[y][x].insert(this.player);
            break;
          case 'i':
            g = spawn(Inky, {x, y});
            this.ghosts.push(g);
            this.board[y][x].insert(g);
            break;
          case 'p':
            g = spawn(Pinky, {x, y});
            this.ghosts.push(g);
            this.board[y][x].insert(g);
            break;
          case 'b':
            g = spawn(Blinky, {x, y});
            this.ghosts.push(g);
            this.board[y][x].insert(g);
            break;
          case 'c':
            g = spawn(Clyde, {x, y});
            this.ghosts.push(g);
            this.board[y][x].insert(g);
            break;
        }
      }
    }
  }

  consoleDraw() {
    for (let i = 0; i < this.height; i++) {
      var rowstr = ''
      for (let j = 0; j < this.width; j++) {
        this.board[i][j].contains('static_wall') ? rowstr += '%%' :
        this.board[i][j].contains('static_ghostgate') ? rowstr += '--' :
        this.board[i][j].contains('item_pellet') ? rowstr += ' º' :
        this.board[i][j].contains('item_powerpellet') ? rowstr += ' ⁕' :
        this.board[i][j].contains('player_pacman') ? rowstr += '😏' :
        this.board[i][j].contains(/ghost/) ? rowstr += '👻' :
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
}

var b = new Board();
b.consoleDraw();

module.exports = Board;