class KeyHandler {
  constructor() {
    this.pressedKeys = {};
    document.addEventListener('keydown', (event) => {
      if (!this.pressedKeys[event.code]) {
        //console.log(event.code, 'pressed');
        this.pressedKeys[event.code] = true;
      }
    });
    document.addEventListener('keyup', (event) => {
      delete this.pressedKeys[event.code];
      //console.log(event.code, 'released');
    });
  }
}

module.exports = KeyHandler;