(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G : {};
  exports.G.Tower = exports.G.Tower ? exports.G.Tower : Tower;

  function Tower(opts){
    this.x = opts.x;
    this.y = opts.y;
    this.dmg = opts.dmg;
    this.color = opts.color;
    this.imgSrc = opts.imgSrc;
    this.speed = opts.speed;
    this.scale = opts.scale;
    this.tick = 0;
  }

  Tower.prototype.fire = function(guideLineRender, missiles, wave, Missile){
    // guideLineRender();
    const target = this.getTarget(wave);
    this.tick++;
    if((this.tick % 100 === 1) && target){
      missiles.push(new Missile({
        targetId:target.id,
        x:this.x,
        y:this.y,
        dmg:this.dmg,
        speed:this.speed,
        name:'arrow',
        color:'blue'
      }));
    }
  };
  Tower.prototype.getTarget = function(wave){
    const that = this;
    let targetIdx = 0;
    let tempDistance = 10000; // max distance
    wave.map((monster,idx)=>{
      const distanceX = Math.abs(that.x - monster.x);
      const distanceY = Math.abs(that.y - monster.y);
      const distance =  distanceX+ distanceY;
      if(tempDistance > distance && distance < 200){
        targetIdx = idx;
        tempDistance = distance;
      }
    });

    if(!(tempDistance >0 &&tempDistance < 200)){
      return;
    }

    return wave[targetIdx];
  };
  Tower.prototype.print = function(/*render,*/ imgRender){
    // render(this)();
    imgRender(this)();
  };
})(window);