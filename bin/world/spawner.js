
var spawner = function(spawnTarget, options) {
  var id = 0;
  return function(spawnTarget, options) {
    var x = new spawnTarget({...options, id: id});
    if (!x.entID) {
      throw `Object with ID ${id} spawned without entID! ${spawnTarget}`;
    }
    id++;
    return x;
  }
}

module.exports = spawner();