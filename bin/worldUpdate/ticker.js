class Ticker {
  constructor() {
    this.entList = [];
    this.frame = 0;
  }
  tick() {
    this.entList.forEach((entity) => {
      entity.tick(this.frame);
      entity.draw(this.frame);
      entity.collide(this.frame);
    })

    this.frame++;
  }
}