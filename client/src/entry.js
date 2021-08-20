const Board = require('./bin/world/Board');
const ticker = require('./bin/world/ticker'); window.ticker = ticker; //For Dev Purposes
const eventHandler = require('./bin/world/GameEventHandler');
const keyHandler = require('./bin/world/KeyHandler');
const oCanvas = require('ocanvas');

window.defaultTileSize = 26;
document.getElementById('pacmanGame').setAttribute('width', window.defaultTileSize * 28);
document.getElementById('pacmanGame').setAttribute('height', window.defaultTileSize * 31);


//prepare canvas to render to
const canvas = oCanvas.create({
  canvas: "#pacmanGame",
  background: "#000"
});

ticker.setCanvas(canvas);
ticker.setEventHandler(eventHandler);
ticker.setKeyHandler(keyHandler);
ticker.setBoard(new Board());
ticker.startTick();