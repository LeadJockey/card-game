(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G : {};
  exports.G.Missile = exports.G.Missile ? exports.G.Missile : Missile;

  let id = 0;
  function Missile(opts){
    this.targetId = opts.targetId;
    this.isMove = true;
    this.id = id++;
    this.x = opts.x;
    this.y = opts.y;
    this.name = opts.name;
    this.dmg = opts.dmg;
    this.color = opts.color;
    this.speed = opts.speed;
  }

  Missile.prototype.move = function(monsters,missiles){
    if(!this.isMove){
      return;
    }

    const target = monsters[this.targetId];
    const targetX = target.x+20;
    const targetY = target.y+20;
    const distanceX = targetX - this.x;
    const distanceY = targetY - this.y;
    const distanceR = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    let x = distanceX / distanceR;
    let y = distanceY / distanceR;
    this.x += (x * this.speed);
    this.y += (y * this.speed);

    if((Math.abs(this.x - targetX) < Math.abs(x * this.speed)) &&
      (Math.abs(this.y - targetY) < Math.abs(y * this.speed))){
      console.log(`hit the target : ${target.id}`);
      target.damaged(this.dmg);
      this.destroy(missiles);
    }
  };

  Missile.prototype.print = function(render){
    render(this)();
  };

  Missile.prototype.destroy = function(missiles){
    missiles.forEach((missile)=>{
      if(missile.id === this.id){
        this.isMove = false;
      }
    });
  };



})(window);