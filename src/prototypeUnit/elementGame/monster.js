(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G:{};
  exports.G.Monster = exports.G.Monster ? exports.G.Monster:Monster;
  function getLineXs(start,length,count){
    const hpLines = [start];
    const each = Math.ceil(length/count);
    console.log(each);
    let i =0;
    let eachHp = start;
    for(i; i < count; i++){
      hpLines.push(eachHp += each);
    }
    hpLines.push(start+length);
    return hpLines;
  }

  function Monster(opts){
    this.name = opts.name;
    this.maxHp = opts.maxHp;
    this.hp = this.maxHp;
    this.exp = opts.exp;
    this.img = opts.img;
    this.status = ['live'];
    this.materialType = opts.materialType; // armor, organic, beast
    this.elementType = opts.elementType; // fire, water, tree
    this.skill = opts.skill;
    this.isAlive();
  }

  Monster.prototype.render = function(render){
    const hpLines = getLineXs(200,160,10);
    const name = this.name.replace('-', ' ');
    const hpX = this.getCurrentHpX(200, 160);

    return () =>{
      render.createRect(30, 40, 300, 460, 'orange')(); // main img
      render.createRect(hpX, 0, 160, 40, '#13ef31')(); // hp
      hpLines.map(eachHpX=>render.createLine(eachHpX,2,eachHpX,38,'black')());
      render.createRect(230, 0, 130, 30, 'white')(); //status
      render.createText(name, 295, 20, 15)();
      render.createTriangle(230, 0, 230, 30, 200, 0, 'white')();//status angle
    }
  };
  Monster.prototype.getCurrentHpX = function(point,length){
    const remainHpPercent = 1-(this.hp / this.maxHp);
    return Math.ceil(point + (length * remainHpPercent));
  };
  Monster.prototype.damaged = function(dmg){
    if(this.hp - dmg > -1){
      this.hp -= dmg;
      console.log(`${this.name}에게 피해 : ${dmg}`);
    }else{
      this.prototype.destroy();
    }
  };
  Monster.prototype.destroy = function(){
    this.status = ['die'];
    console.log(`${this.name} 파괴`);
  };
  Monster.prototype.isAlive = function(){
    return this.status.indexOf('live') > -1;
  };

})(window);