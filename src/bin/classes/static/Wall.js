const ocanvas = require('ocanvas');
const Entity = require('../entity');

module.exports = class Wall extends Entity {
  constructor(options = {}) {
    super(options);
    this.pathable = false;
    this.entID = 'static_wall';
  }
  draw() {
    console.log('wall');
  }
}