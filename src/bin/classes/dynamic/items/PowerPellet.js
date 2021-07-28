const Pellet = require('./Pellet');

module.exports = class PowerPellet extends Pellet {
  constructor(options) {
    super(options);
    this.entID = 'item_powerpellet';
  }
  collect() {
    console.log('POWERPELLET COLLECTED! GET EM BOYS');
  }
}