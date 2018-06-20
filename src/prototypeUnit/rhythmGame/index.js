(function(doc, _){
  'use strict';

  const canvas = doc.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const size = 100;
  const btnColor = 'gold';
  const presetState = {
    gameScale:4, // game 배수
    givenWords:[],
    userCode:[],
    gage:30,
    score:0,
    btn1:{type:'arc',c:btnColor, s:50, x:0, y:500},
    btn2:{type:'arc',c:btnColor, s:50, x:100, y:500},
    btn3:{type:'arc',c:btnColor, s:50, x:200, y:500},
    btn4:{type:'arc',c:btnColor, s:50, x:300, y:500}
  };

  const rhythmGame = new _.Structure(presetState);
  const _state = rhythmGame.state;

  //init
  setGivenWords();
  setGage();

  //rending
  rhythmGame.renderedBy('gage-update')(drawGageBar);
  rhythmGame.renderedBy('update')(drawClearScreen,drawGivenWords,drawScore,drawBtns);
  rhythmGame.trigger('update');

  window.addEventListener('keydown', (evt) =>{
    getUserWords(evt.keyCode);
    resetUserCode(evt.keyCode);
    setEventBtn(evt.keyCode);
  });
  window.addEventListener('keyup',(evt)=>{resetBtn(evt.keyCode);});

  //utils
  function equal(arr1,arr2){
    let cnt = 0;
    arr1.forEach((v,i)=>{
      if(v === arr2[i]){
        cnt++;
      }
    });

    return arr1.length === cnt;
  }
  //set
  function setEventBtn(keyCode){
    const grd = ctx.createLinearGradient(100, 400, 100, 600);
    const grdSpecial = ctx.createLinearGradient(100,400,100,600);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    grd.addColorStop(1, 'rgba(0, 0, 255, 0.5)');
    grdSpecial.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    grdSpecial.addColorStop(1, 'rgba(213, 11, 179, 0.5)');
    switch(keyCode){
      case 49:
        rhythmGame.setState('update',{btn1:{..._state.btn1,c:'blue'}});
        drawShape({type:'square',c:grd, x:10, y:400, sx:80, sy:180 });
        break;
      case 50:
        rhythmGame.setState('update',{btn2:{..._state.btn2,c:'blue'}});
        drawShape({type:'square',c:grd, x:110, y:400, sx:80, sy:180 });
        break;
      case 51:
        rhythmGame.setState('update',{btn3:{..._state.btn3,c:'blue'}});
        drawShape({type:'square',c:grd, x:210, y:400, sx:80, sy:180 });
        break;
      case 52:
        rhythmGame.setState('update',{btn4:{..._state.btn4,c:'deeppink'}});
        drawShape({type:'square',c:grdSpecial, x:310, y:400, sx:80, sy:180 });
        break;
      default:
        console.log('no matching key');
    }
  }
  function setGivenWords(){
    rhythmGame.setState('update',{givenWords:getGivenWords(_state.gameScale)});
  }
  function setGage(){
    const min = 30;
    const max = 340;
    const fps = 5;
    let gage = min;
    setInterval(function(){
      if(_state.gage >= min && _state.gage < max){
        gage += 1;
      }else{
        gage = min;
      }
      rhythmGame.setState('gage-update', { gage:gage });
    }, fps);
  }
  function resetBtn(keyCode){
    switch(keyCode){
      case 49: rhythmGame.setState('update',{btn1:{..._state.btn1,c:btnColor}}); break;
      case 50: rhythmGame.setState('update',{btn2:{..._state.btn2,c:btnColor}}); break;
      case 51: rhythmGame.setState('update',{btn3:{..._state.btn3,c:btnColor}}); break;
      case 52: rhythmGame.setState('update',{btn4:{..._state.btn4,c:btnColor}}); break;
      default: console.log('no matching key');
    }
  }
  function resetUserCode(keyCode){
    if(keyCode !== 32){
      return;
    }
    const gage = _state.gage;
    let score = 0;

    if(equal(_state.userCode,_state.givenWords)){
      if(gage > 260 && gage < 320){
        score = 40 * 2;
      }else if(gage > 160 && gage < 250){
        score = 40 + 20;
      }else{
        score = 40;
      }
    }

    rhythmGame.setState('update',{userCode:[],score:_state.score + score});
    setGivenWords();
  }
  //get
  function getGivenWords(scale){
    const givenWords= [];
    let i= 1;
    for(i; i <= scale; i++){
      givenWords.push(getRandomNumber(scale));
    }
    return givenWords;
  }
  function getRandomNumber(scale){
    return Math.floor((Math.random() * scale) + 1);
  }
  function getUserWords(keyCode){
    if(_state.userCode.length < (_state.gameScale)){
      switch(keyCode){
        case 49: rhythmGame.setState('update',{userCode:_state.userCode.concat([1])}); break;
        case 50: rhythmGame.setState('update',{userCode:_state.userCode.concat([2])}); break;
        case 51: rhythmGame.setState('update',{userCode:_state.userCode.concat([3])}); break;
        case 52: rhythmGame.setState('update',{userCode:_state.userCode.concat([4])}); break;
        default: console.log('no matching key');
      }
    }
  }
  function getWordStrokeColor(val, idx){
    if(_state.userCode[idx]){
      return val === _state.userCode[idx] ? '#008b22' : '#ff2827';
    }
    return '#000';
  }

  //draw
  function drawClearScreen(){
    drawShape({type:'square',c:'#fff', x:0, y:0, sx:ctx.canvas.width, sy:ctx.canvas.height });
  }
  function drawShape(obj){
    switch(obj.type){
      case 'arc':
        ctx.beginPath();
        ctx.arc(obj.x + (size / 2), obj.y + (size / 2), obj.s, 0, 2*Math.PI, false);
        ctx.fillStyle = obj.c || '#000';
        ctx.fill();
        break;
      case 'stroke-arc':
        ctx.beginPath();
        ctx.arc(obj.x + (size / 2), obj.y + (size / 2), obj.s, 0, 2*Math.PI, false);
        ctx.strokeStyle = obj.c || '#000';
        ctx.stroke();
        break;
      case 'square':
        ctx.fillStyle = obj.c || '#000';
        ctx.fillRect(obj.x, obj.y, obj.sx, obj.sy);
        break;
      default:
        console.log('no matching shape');
    }
    return (txtObj) =>{
      ctx.font = `${txtObj.s || 30}px ${txtObj.f || 'Comic Sans MS'}`;
      ctx.fillStyle = txtObj.c || '#fff';
      ctx.textAlign = txtObj.a || 'center';
      ctx.fillText(txtObj.t, obj.x + (txtObj.tx || 0), obj.y + (txtObj.ty || 0));
    };
  }
  function drawBtns(){
    drawShape({type:'square',c:btnColor, x:0, y:550, sx:400, sy:50 });
    drawShape(_state.btn1)({t:'1',s:50,tx:50,ty:70});
    drawShape(_state.btn2)({t:'2',s:50,tx:50,ty:70});
    drawShape(_state.btn3)({t:'3',s:50,tx:50,ty:70});
    drawShape(_state.btn4)({t:'4',s:50,tx:50,ty:70});
  }
  function drawGivenWords(){
    drawShape({type:'square',c:'#efefef', x:50, y:400, sx:300, sy:30 });
    _state.givenWords.forEach((val,idx)=>{
      drawShape({type:'arc',c:val === 4 ? 'deeppink' : 'blue', s:20, x:60+(idx*60) , y:350})({t:val,s:20,tx:50,ty:58});
      const color = getWordStrokeColor(val,idx);
      if(color === '#000'){
        drawShape({type:'stroke-arc',c:getWordStrokeColor(val,idx), s:22, x:60+(idx*60) , y:350});
      }else{
        drawShape({type:'stroke-arc',c:getWordStrokeColor(val,idx), s:22, x:60+(idx*60) , y:350})
        ({t:color === '#008b22' ?'great':'bad',c:color,s:20,tx:50,ty:20});
      }
    });
  }
  function drawGageBar(){
    const grd = ctx.createLinearGradient(30, 440, 340, 440);
    grd.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
    grd.addColorStop(0.7, 'rgba(0, 0, 255, 0.3)');
    grd.addColorStop(0.8, 'rgba(0, 255, 0, 0.3)');
    grd.addColorStop(0.9, 'rgba(0, 255, 0, 0.3)');
    grd.addColorStop(1, 'rgba(255, 0, 0, 0.5)');
    drawShape({type:'square',c:'#fff', x:30, y:435, sx:340, sy:20 });
    drawShape({type:'square',c:grd, x:30, y:440, sx:340, sy:10 });
    drawShape({type:'square',c:'#ef2adf', x:_state.gage, y:435, sx:20, sy:20 });
  }
  function drawScore(){
    drawShape({type:'square', x:100,c:'#fff', y:0, sx:200, sy:100 })({t:_state.score,c:'#000',s:70,tx:100,ty:70});

  }

})(document, window.M);