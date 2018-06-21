(function(doc, _){
  'use strict';

  const p1 = new _.Player({
    id:0,
    name:'shawn',
    cost:0,
    life:10,
    attack:1,
    decks:['뿅망치 무지','고뇌하는 라이언'],
    cards:[],
    summons:[],
    effects:[]
  });
  const p2 = new _.Player({
    id:1,
    name:'bred',
    cost:0,
    life:10,
    attack:1,
    decks:['고뇌하는 라이언','뿅망치 무지'],
    cards:[],
    summons:[],
    effects:[]
  });

  const presetState = {
    players:[p1,p2],
    cost:1,
    turn:1,
    timeout:60
  };
  console.log('preset',presetState);
  const kakaoStone = new _.Game(presetState);
  const _state = kakaoStone.state;

  //initialize game
  pickCards();
  // rendering
  kakaoStone.renderedBy('init')();
  kakaoStone.renderedBy('update')();
  kakaoStone.renderedBy('timeout')();

// drag
  
  const cardList = Array.prototype.slice.call(doc.querySelectorAll('.list-card li'));

  let dragged;

  cardList.forEach((elem, i) =>{
    elem.addEventListener('dragstart', (e) =>{
      console.log('dragstart' + i);
      dragged = e.target;
      console.log(dragged);
      e.target.style.display = "none";
    },false);
    // elem.addEventListener('dragover', () =>{
    //   // console.log('dragover' + i);
    // });
    doc.addEventListener('drop', (e) =>{
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      if ( e.target.className === "dropzone" ) {
        e.target.style.background = "";
        dragged.parentNode.removeChild( dragged );
        e.target.appendChild( dragged );
      }    });
    // doc.addEventListener('dragleave', (e) =>{
    //   console.log('dragleave',e.target);
    //   console.log('dragleave,dragged',dragged);
    // });
  });

  // doc.addEventListener('dragstart',()=>{
  //   console.log('dragstart');
  // });
  // doc.addEventListener('dragover',()=>{
  //   console.log('dragover');
  // });
  // doc.addEventListener('dragdrop',()=>{
  //   console.log('dragend');
  // });
  // doc.addEventListener('drop',()=>{
  //   console.log('drop');
  // });
  // doc.addEventListener('dragenter',()=>{
  //   console.log('dragenter');
  // });
  //
  function dragStart(ev) {
    console.log('dragStart');
    // ev.dataTransfer.effectAllowed='copy';
    // ev.dataTransfer.setData("id", ev.target.getAttribute('id'));
    // ev.dataTransfer.setDragImage(ev.target,100,100);
    return true;
  }
  function dragEnter(ev) {
    event.preventDefault();
    return true;
  }
  function dragOver(ev) {
    event.preventDefault();
  }
  function dragDrop(ev) {
    // const data = ev.dataTransfer.getData("id");
    // ev.target.appendChild(document.getElementById(data));
    // ev.stopPropagation();
    return false;
  }

  // set
  function pickCards(){
    const newPlayers = [];
    _state.players.map((player) =>{
      const newCard = player.decks[getRandomIdx(player.decks.length)];
      const newCards = player.cards.concat(newCard);
      const newPlayer = { ...player, cards:newCards };
      console.log(`#${player.name} : new Card picked`, newCards);
      newPlayers.push(newPlayer);
    });
    kakaoStone.setState('set', { players:newPlayers});
  }

  //get
  function getRandomIdx(length, start){
    return Math.floor((Math.random() * length) + (start || 0));
  }

  // event
  function battle(attacker, defender){

  }
  // draw
  function drawCards(){

  }

})(document, window.KaKaoStone);