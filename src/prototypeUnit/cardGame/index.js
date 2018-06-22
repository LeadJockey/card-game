(function(doc, _){
  'use strict';
  //util
  function getElems(selector, parent){
    return Array.prototype.slice.call((parent || doc).querySelectorAll(selector));
  }
  function hasClass(elem, className){
    if(!elem || !elem.classList || !elem.classList.value){
      return false;
    }
    return elem.classList.value.indexOf(className) > -1;
  }

  //elem
  const ctx = getElems('.wrap_game')[0];
  const awayCardList = getElems('.field_away .list_summon', ctx)[0];
  const homeCardList = getElems('.field_home .list_summon', ctx)[0];

  //game structure
  const presetState = {
    home:new _.Player({
      id:0,
      name:'shawn',
      cost:0,
      life:10,
      attack:1,
      decks:[],
      cards:[new _.Card(1,_.cards[0]),new _.Card(2,_.cards[0]),new _.Card(3,_.cards[0]),new _.Card(4,_.cards[0])],
      summons:[],
      effects:[]
    }),
    away:new _.Player({
      id:1,
      name:'bred',
      cost:0,
      life:10,
      attack:1,
      decks:[],
      cards:[new _.Card(5,_.cards[1]), new _.Card(6,_.cards[1])],
      summons:[],
      effects:[]
    })
  };
  const game = new _.Game(presetState);


  function createCardTemplate(opts, team){
    const card = doc.createElement('li');
    card.setAttribute('data-uniqueId',opts.uniqueId);
    card.setAttribute('class', team);
    card.setAttribute('draggable', 'true');
    card.innerHTML = `
      <div>unique:${opts.uniqueId}</div>
      <img src="https://dummyimage.com/100x100/000/fff" draggable="false" alt="">
      <div>att:${opts.attack}  -------  ${opts.life}:life</div>
    `;
    return card;
  }

  function drawCards(appendTarget, team){
    return ()=>{
      game.state[team].cards.map((card)=>{
        appendTarget.appendChild(createCardTemplate(card,team));
      });
    }
  }

  drawCards(awayCardList, 'away')();
  drawCards(homeCardList, 'home')();


  function battle(attacker, defender){
    defender.life -= attacker.attack;
    attacker.life -= defender.attack;
  }

  let currentTarget = null;
  let attacker = null;

  doc.addEventListener('dragstart',(e)=>{
    console.log('dragstart', e.target);
    attacker = e.target;
    setTimeout(()=> attacker.className="invisible", 100);
  });
  doc.addEventListener('dragenter',(e)=>{
    currentTarget = e.target;
  });
  doc.addEventListener('dragover',(e)=>{
    // console.log('dragover');
  });
  doc.addEventListener('dragend',(e)=>{
    e.target.classList = 'home';
    console.log('dragend',currentTarget);
    if(currentTarget){

      // console.log(game.state.away.cards);
      // const t = game.state.away.cards.filter((card)=>card.id === 0);
      // console.log(t);
    }
  });



})(document, window.KaKaoStone);