class Ticker {
  constructor() {
    this.entList = [];
    this.frame = 0;
  }
  tick(board) {
    this.entList.forEach((entity) => {
      entity.tick ?
        entity.tick(this.frame) : null;
      entity.draw ?
        entity.draw(this.frame) : null;
      entity.collide ?
        entity.collide(this.frame) : null;
    })

    this.frame++;
  }
}

module.exports = Ticker;