module.exports = class KeyHandler {

  constructor() {
    this.pressedKeys = {};

    document.addEventListener('keydown', (event) => {
      if (!this.pressedKeys[event.code]) {
        this.pressedKeys[event.code] = true;
        window.pacmanConfig.logKeyPresses ? console.log(event.code, 'pressed') : null;
      }
    });

    document.addEventListener('keyup', (event) => {
      delete this.pressedKeys[event.code];
      window.pacmanConfig.logKeyPresses ? console.log(event.code, 'released') : null;
    });
  }
}