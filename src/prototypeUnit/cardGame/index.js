(function(doc, _){
  'use strict';

  const shawn = new _.Player({
    id:0,
    name:'shawn',
    cost:0,
    life:10,
    attack:1,
    decks:['뿅망치 무지','뿅망치 무지'],
    cards:[],
    summons:[],
    effects:[]
  });
  const bred = new _.Player({
    id:1,
    name:'bred',
    cost:0,
    life:10,
    attack:1,
    decks:['고뇌하는 라이언','고뇌하는 라이언'],
    cards:[],
    summons:[],
    effects:[]
  });

  const presetState = {
    players:[shawn,bred],
    cost:5,
    turn:1,
    timeout:60
  };
  const kakaoStone = new _.Game(presetState);
  const _state = kakaoStone.state;

  //initialize game
  setCards();
  // rendering


  // set TODO 수정필요
  function setCards(){
    const t = _state.players.map((player)=>{
      const cards = [];
      player.decks.map((name)=>{
        cards.push(new _.Card(_.cards.filter((card)=>card.name === name)));
      });
    });
    kakaoStone.setState('set', {players:t});
  }

  // event
  function battle(attacker, defender){

  }
  // draw
  function drawCards(){

  }









})(document, window.KaKaoStone);