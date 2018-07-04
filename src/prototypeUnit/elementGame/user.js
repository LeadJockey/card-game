(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G:{};
  exports.G.User = exports.G.User ? exports.G.User:User;

  function User(opts){
    this.name = opts.name;
    this.maxHp = opts.maxHp;
    this.hp = this.maxHp;
    this.exp = opts.exp;
    this.status = ['live'];
  }

  User.prototype.render = function(render){
    const hpLines = this.getLineXs(0,160,10);
    const name = this.name.replace('-', ' ');
    const hpX = this.getCurrentHpX(0, 160);

    return () =>{
      render.createRect(hpX, 0, 160, 40, '#13ef31')(); // hp
      hpLines.map(eachHpX=>render.createLine(eachHpX,2,eachHpX,38,'black')());
      render.createRect(0, 0, 130, 30, 'white')(); //info
      render.createTriangle(130, 0, 130, 30, 160, 0)();//info angle
      render.createText(name, 65, 20, 15)();
    }
  };
  User.prototype.getCurrentHpX = function(point,length){
    const remainHpPercent = 1-(this.hp / this.maxHp);
    return Math.ceil(point + (length * remainHpPercent));
  };
  User.prototype.getLineXs = function(start,length,count){
    const hpLines = [start];
    const each = Math.ceil(length/count);
    let i =0;
    let eachHp = start;
    for(i; i < count; i++){
      hpLines.push(eachHp += each);
    }
    hpLines.push(start+length);
    return hpLines;
  };

})(window);
