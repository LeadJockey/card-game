(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G : {};
  exports.G.Spot = exports.G.Spot ? exports.G.Spot : Spot;

  function Spot(opts){
    this.x = opts.x;
    this.y = opts.y;
    this.color = opts.color;
    this.direction = opts.direction;
  }
  Spot.prototype.track = function(monster){
    if(!(this.x === monster.x && this.y === monster.y)){
      return;
    }
    monster.moveTo(this.direction);
  };
  Spot.prototype.print = function(render){
    render(this)();
  };
})(window);