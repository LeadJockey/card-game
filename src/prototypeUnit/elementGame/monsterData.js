(function(exports){
  'use strict';

  /**
   * @type Array -> {{
   *   name : string,
   *   maxHp : number,
   *   img : String,
   *   materialType : string,// armor, organic, beast
   *   elementType : string,// fire, water, tree
   *   skill : skill,
   *   exp : number
   * }}
   **/
  const monsters = [
    {
      name:'green-knight',
      materialType:'armor',
      elementType:'tree',
      img:'https://dummyimage.com/300x460/fcb3fc/979ce8',
      maxHp:100,
      exp:10,
      skill:smash,

    }
  ];

  function findMonster(name){
    const target = monsters.filter(monster=>monster.name === name);
    return target.length > 0 ? target[0] :{};
  }
  function smash(user){
    const dmg = 15;
    const delay = 3;
    user.damaged(dmg);
  }

  exports.G = exports.G ? exports.G:{};
  exports.G.data = exports.G.data ? exports.G.data:{};
  exports.G.data.monsters = exports.G.data.monsters ? exports.G.data.monsters:monsters;
  exports.G.data.findMonster = exports.G.data.findMonster ? exports.G.data.findMonster:findMonster;

})(window);
