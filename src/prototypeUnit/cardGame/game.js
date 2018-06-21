(function(exports){
  const cards = [
    {
      name:'뿅망치 무지',
      type:'무지',
      level:1,
      cost:1,
      attack:1,
      life:1,
      desc:'무지가 무작위 아군에게 뿅망치를 선물합니다. 뿅망치를 받은 아군은 공격력 +2',
      skill:function(){}
    },
    {
      name:'고뇌하는 라이언',
      type:'라이언',
      level:4,
      cost:2,
      attack:2,
      life:5,
      desc:'라이언이 고뇌하기 시작합니다. 도발',
      skill:function(){}
    }
  ];

  function Card(data){
    this.name = data.name;
    this.type = data.type;
    this.level = data.level;
    this.cost = data.cost;
    this.attack = data.attack;
    this.life = data.life;
    this.skill = data.skill;
  }

  function Player(opts){
    this.id = opts.id;
    this.name = opts.name;
    this.cost = opts.cost;
    this.life = opts.life;
    this.attack = opts.attack;
    this.decks = opts.decks;
    this.cards = opts.cards;
    this.summons = opts.summons;
    this.effects = opts.effects;
  }

  exports.KaKaoStone = {};
  exports.KaKaoStone.Game = exports.M.Structure;
  exports.KaKaoStone.cards = cards;
  exports.KaKaoStone.Card = Card;
  exports.KaKaoStone.Player = Player;
})(window);