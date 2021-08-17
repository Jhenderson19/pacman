const Board = require('./bin/world/board');
const Ticker = require('./bin/world/ticker'); window.ticker = Ticker; //For Dev Purposes
const oCanvas = require('ocanvas');
//prepare canvas to render to
const canvas = oCanvas.create({
  canvas: "#pacmanGame",
  background: "#000",
  fps: 16
});

Ticker.setCanvas(canvas);
var board = new Board();
window.ticker.register(board);