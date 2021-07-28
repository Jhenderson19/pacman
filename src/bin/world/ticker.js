class Ticker {
  constructor() {
    this.entList = [];
    this.frame = 0;
    this.tickInterval = Math.floor(1000/16);
    this.intervalDigit = 0;
    this.ticking = false;
  }
  register(obj) {
    this.entList.push(obj);
  }
  list() {
    return this.entList;
  }
  tick() {
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
  startTick() {
    if(!this.ticking) {
      this.intervalDigit = setInterval(this.tick.bind(this), this.tickInterval);
      this.ticking = true;
    }
  }
  stopTick() {
    if(this.ticking) {
      clearInterval(this.intervalDigit);
      this.ticking = false;
    }
  }
}

module.exports = new Ticker();