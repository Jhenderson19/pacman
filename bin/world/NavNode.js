const Entity = require('../classes/entity');
const Board = require('./board');

module.exports = class NavNode extends Entity {
  constructor(options) {
    super(options);
    if(!NavNode.prototype.NavNodes) {
      NavNode.prototype.NavNodes = [];
    }
    NavNode.prototype.NavNodes.push(this);
  }
}