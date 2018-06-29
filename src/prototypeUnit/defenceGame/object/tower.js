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

  Tower.prototype.fire = function(monster){
    // const movement = setInterval(arrow, gameFPS/4);
    // const center = this.scale / 2;
    // const radian = Math.PI / 180; // 1도 = 0.0174.. radian, //360 * radian === Math.PI *2
    // const tx = this.x + center;
    // const ty = this.y + center;
    // const mx = monster.x + center;
    // const my = monster.y + center;
    // const angle = (my - ty) / (mx - tx);
    //
    // const sin = (-mx * Math.sign(Math.sin(tx)));
    // const cos = (my * Math.sign(Math.cos(ty)));
    // console.log('angle', Math.floor(Math.sin(angle * radian) * 100));
    // console.log('x', sin);
    // console.log('y', cos);
    //
    // const testX = sin;
    // const testY = cos;
    //
    // ctx.beginPath();
    // ctx.arc(testX, testY, 5, 0, 2 * Math.PI, false);
    // ctx.fillStyle = 'red';
    // ctx.fill();
    //
    // ctx.beginPath();
    // ctx.moveTo(tx, ty);
    // ctx.lineTo(mx, my);
    // ctx.strokeStyle = "green";
    // ctx.stroke();
  };
  Tower.prototype.print = function(render, imgRender){
    render(this)();
    imgRender(this)();
  };
})(window);