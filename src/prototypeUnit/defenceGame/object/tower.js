(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G : {};
  exports.G.Tower = exports.G.Tower ? exports.G.Tower : Tower;

  function Tower(opts){
    this.x = opts.x;
    this.y = opts.y;
    this.color = opts.color;
    this.imgSrc = opts.imgSrc;
    this.attackSpeed = opts.attackSpeed;
    this.scale = opts.scale;
  }

  Tower.prototype.fire = function(fnc){
    fnc();
  };
  Tower.prototype.print = function(/*render, */imgRender){
    // render(this)();
    imgRender(this)();
  };
})(window);