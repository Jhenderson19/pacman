const Board = require('./bin/world/board');
const Ticker = require('./bin/world/ticker'); window.ticker = Ticker; //For Dev Purposes
const oCanvas = require('ocanvas');

window.defaultTileSize = 26;
document.getElementById('pacmanGame').setAttribute('width', window.defaultTileSize * 28);
document.getElementById('pacmanGame').setAttribute('height', window.defaultTileSize * 31);


//prepare canvas to render to
const canvas = oCanvas.create({
  canvas: "#pacmanGame",
  background: "#000",
  fps: 60
});

Ticker.setCanvas(canvas);
var board = new Board();
window.ticker.register(board);