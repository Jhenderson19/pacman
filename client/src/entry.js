const Board = require('./bin/world/Board');
const ticker = require('./bin/world/ticker'); window.ticker = ticker; //For Dev Purposes
const oCanvas = require('ocanvas');

window.defaultTileSize = 26;
window.pause = false;
document.getElementById('pacmanGame').setAttribute('width', window.defaultTileSize * 28);
document.getElementById('pacmanGame').setAttribute('height', window.defaultTileSize * 31);


//prepare canvas to render to
const canvas = oCanvas.create({
  canvas: "#pacmanGame",
  background: "#000"
});

ticker.setCanvas(canvas);
window.ticker.register(new Board());
ticker.startTick();