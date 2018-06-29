(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G : {};
  exports.G.Monster = exports.G.Monster ? exports.G.Monster : Monster;

  function Monster(opts){
    this.x = opts.x;
    this.y = opts.y;
    this.hp = opts.hp || 100;
    this.size = opts.size;
    this.status = ['live'];
    this.color = opts.color;
    this.speed = opts.speed;
    this.direction = opts.direction;
    this.minFrame = opts.minFrame;
    this.maxFrame = opts.maxFrame;
    this.scale = opts.scale;
  }
  Monster.prototype.damaged = function(damage){
    const afterDamaged = this.hp - damage;
    if(afterDamaged < 1){
      console.log('die');
      this.destroy();
    }else{
      console.log('damaged : ', damage);
      this.hp = afterDamaged;
    }
  };
  Monster.prototype.isInFrame = function(nextStep){
    return nextStep > this.minFrame - 1 && nextStep < this.maxFrame + 1;
  };
  Monster.prototype.moveTo = function(direction){
    switch(direction){
      case 'right':this.toTheRight();break;
      case 'left':this.toTheLeft();break;
      case 'top':this.toTheTop();break;
      case 'bottom':this.toTheBottom();break;
      default:break;
    }
    return this;
  };
  Monster.prototype.toTheRight = function(){
    const nextStep = this.x + this.speed;
    if(!this.isInFrame(nextStep)){
      return;
    }
    this.x = nextStep;
    this.direction = 'right';
  };
  Monster.prototype.toTheLeft = function(){
    const nextStep = this.x - this.speed;
    if(!this.isInFrame(nextStep)){
      return;
    }
    this.x = nextStep;
    this.direction = 'left';
  };
  Monster.prototype.toTheTop = function(){
    const nextStep = this.y - this.speed;
    if(!this.isInFrame(nextStep)){
      return;
    }
    this.y = nextStep;
    this.direction = 'top';
  };
  Monster.prototype.toTheBottom = function(){
    const nextStep = this.y + this.speed;
    if(!this.isInFrame(nextStep)){
      return;
    }
    this.y = nextStep;
    this.direction = 'bottom';
  };
  Monster.prototype.destroy = function(){
    this.status = ['die'];
  };
  Monster.prototype.isLive = function(){
    return this.status.toString().indexOf('live') > -1;
  };
  Monster.prototype.print = function(render){
    if(!this.isLive()){
      return;
    }
    render(this)();
  };


})(window);