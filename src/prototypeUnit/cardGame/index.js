(function(doc, _){
  'use strict';

  //game structure
  const presetState = {
    home:new _.Player({
      id:0,
      name:'shawn',
      cost:0,
      life:10,
      attack:1,
      decks:[
        new _.Card(1, _.cards[0]),
        new _.Card(2, _.cards[0]),
        new _.Card(3, _.cards[0]),
        new _.Card(4, _.cards[0])
      ],
      cards:[],
      summons:[],
      effects:[]
    }),
    away:new _.Player({
      id:1,
      name:'brad',
      cost:0,
      life:10,
      attack:1,
      decks:[],
      cards:[
        new _.Card(5, _.cards[1]),
        new _.Card(6, _.cards[1])
      ],
      summons:[],
      effects:[]
    }),
    cost:1
  };
  const game = new _.Game(presetState);
  const util = new _.Util(doc);


  //elem
  const ctx = util.select('.wrap_game');
  const awayCardList = util.select('.field_away .list_summon', ctx);
  const homeCardList = util.select('.field_home .list_summon', ctx);
  const btn = util.select('#btn', ctx);

  //setCard
  //getCard
  //drawCard
  //onBattle
  //onTurnOver

  function playACard(){
    const randomIdx = Math.floor(Math.random() * game.state.home.decks.length);
    const randomCard = game.state.home.decks[randomIdx];
    game.state.home.cards.push(randomCard);
    game.trigger('update');
  }
  
  function setCard(opts, team){
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
  function getCard(type, uniqueId){
    return game.state[type].cards.filter((card)=>card.uniqueId === uniqueId)[0];
  }
  function drawCards(appendTarget, team){
    return ()=>{
      appendTarget.innerHTML ='';
      game.state[team].cards.filter((card)=>card.life >0).map((card)=>{
        appendTarget.appendChild(setCard(card,team));
      });
    }
  }

  game.renderedBy('update')(
    drawCards(awayCardList, 'away'),
    drawCards(homeCardList, 'home')
  );
  game.trigger('update');


  function battle(attacker, defender){
    console.log('battle start');
    defender.life -= attacker.attack;
    attacker.life -= defender.attack;
    game.setState({})
    game.trigger('update');
    console.log(game.state);
  }

  //card.onBattle
  //

  let fromTarget = null;
  let toTarget = null;


  btn.addEventListener('click',()=>{
    playACard();
  });
  doc.addEventListener('dragstart',(e)=>{
    // console.log('dragstart', e.target);
    fromTarget = e.target;
    setTimeout(()=> fromTarget.className="invisible", 100);
  });
  doc.addEventListener('dragenter',(e)=>{
    const tmp = util.parent('LI', e.target);
    if(!tmp || tmp.classList.value.indexOf('away') === -1){return;}
      if(toTarget){
      toTarget.style.backgroundColor = 'white';
      }
      toTarget = tmp;
      toTarget.style.backgroundColor = 'red';
      console.log(toTarget);
  });
  doc.addEventListener('dragover',(e)=>{
    // if(e.target.classList = 'away'){
    //   // console.log(e.target);
    // }
  });
  doc.addEventListener('dragend',(e)=>{
    e.target.classList = 'home';
    if(toTarget){
      battle(
        getCard('away', Number.parseInt(toTarget.dataset.uniqueid, 10)),
        getCard('home', Number.parseInt(fromTarget.dataset.uniqueid, 10))
      );
      console.log(fromTarget);
      const t = util.select(`[data-uniqueId='${fromTarget.dataset.uniqueid}']`);
      t.style.backgroundColor = 'gray';
      t.getAttribute('draggable');
      t.setAttribute('draggable', 'false');
      fromTarget = null;
    }
  });



})(document, window.KaKaoStone);