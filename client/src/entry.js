const Board = require('./bin/world/Board');
const Ticker = require('./bin/world/ticker');
const GameEventHandler = require('./bin/world/GameEventHandler');
const KeyHandler = require('./bin/world/KeyHandler');
const StateHandler = require('./bin/world/StateHandler');
const oCanvas = require('ocanvas');

let board = new Board();
let ticker = new Ticker();
board.setTicker(ticker);
ticker.setBoard(board);
ticker.setEventHandler(new GameEventHandler());
ticker.setKeyHandler(new KeyHandler());
ticker.setStateHandler(new StateHandler());

window.defaultTileSize = 16;
document.getElementById('pacmanGame').setAttribute('width', window.defaultTileSize * board.width);
document.getElementById('pacmanGame').setAttribute('height', window.defaultTileSize * board.height);

//prepare canvas to render to
const canvas = oCanvas.create({
  canvas: "#pacmanGame",
  background: "#000"
});

board.populate();
ticker.setCanvas(canvas);
ticker.startTick();
window.ticker = ticker;