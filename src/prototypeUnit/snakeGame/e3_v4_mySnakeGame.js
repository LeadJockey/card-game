(function(_){
  'use strict';

  //const
  const directionKeyMap = {
    37:'left',
    38:'up',
    39:'right',
    40:'down'
  };

  //elem
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const size = canvas.width / 25; // 50
  let directionQueue = 'up';

  const presetState = {
    fps:100,
    map:[],
    snakes:[],
    food:{},
    snakePool:{
      shawn:{
        body:[33, 34, 35, 36, 37],
        directionQueue:'up',
        movement:function(){}
      },
      ai_jarvis:{
        body:[56, 55, 54, 53, 52],
        directionQueue:'down',
        movement:function(){}
      }
    }
  };
  const snakeGame = new _.Structure(presetState);
  const _state = snakeGame.state;

  init();

  function init(){
    const initialize = new _.Pipeline();
    initialize.pipe(createMap)
              .pipe(createSnake('shawn', 'red'))
              .pipe(createSnake('ai_jarvis', 'blue'))
              .pipe(createFood('green'))
              .pipe(drawInitialSnake)
              .pipe(drawInitialFood)
              .process(_state);
    snakeGame.renderedBy('update-move')(
      drawClearScreen,
      drawFood,
      drawSnake('shawn'),
      drawSnake('ai_jarvis')
    );
    // moveByUser('shawn');
    moveByAI('ai_jarvis');
    moveByAI('shawn');
  }

  function createMap(state){
    const map = [];
    const len = canvas.width;
    let index = 0;
    for(let x = 0; x < len; x += size){
      for(let y = 0; y < len; y += size){
        map.push({
          x:x,
          y:y,
          hasObject:false,
          isAbleToMove:true,
          color:'#fff',
          index:index++
        });
      }
    }
    state.map = map;
    console.log('created map');
    return state;
  }

  function createSnake(id, color){
    return function(state){
      const snake = [];
      _state.snakePool[id].body.forEach((index) =>{
        const eachSnakePart = _state.map[index];
        eachSnakePart.hasObject = true;
        eachSnakePart.isAbleToMove = false;
        eachSnakePart.color = color || '#000';
        state.snakes.push(eachSnakePart);
        snake.push(eachSnakePart);
        _state.snakePool[id].body = snake;
      });
      console.log('created snake ' + id);
      return state;
    }
  }

  function createFood(color){
    return function(state){
      const emptySpots = _state.map.filter(spot => !spot.hasObject);
      const randomIndex = Math.floor(Math.random() * emptySpots.length);
      const food = emptySpots[randomIndex];
      food.hasObject = true;
      food.isAbleToMove = true;
      food.color = color || '#000';
      state.food = food;
      console.log('created food');
      return state;
    }
  }

  function getSnakes(){
    const newSnakes = [];
    for(let snakeId in _state.snakePool){
      if(_state.snakePool.hasOwnProperty(snakeId)){
        _state.snakePool[snakeId].body.forEach(e => newSnakes.push(e));
      }
    }
    return newSnakes;
  }

  function findNear(id){
    const head = _state.snakePool[id].body[0];
    const moveAbleList = [];
    let up = null;
    let down = null;
    let left = null;
    let right = null;
    _state.map.forEach((spot) =>{
      //up
      if((spot.x === head.x) && (spot.y === head.y - size)){
        up = spot;
        if(spot.isAbleToMove){
          moveAbleList.push(spot);
        }
      }
      //down
      if((spot.x === head.x) && (spot.y === head.y + size)){
        down = spot;
        if(spot.isAbleToMove){
          moveAbleList.push(spot);
        }
      }
      //left
      if((spot.y === head.y) && (spot.x === head.x - size)){
        left = spot;
        if(spot.isAbleToMove){
          moveAbleList.push(spot);
        }
      }
      //right
      if((spot.y === head.y) && (spot.x === head.x + size)){
        right = spot;
        if(spot.isAbleToMove){
          moveAbleList.push(spot);
        }
      }
    });

    return {
      up,
      down,
      left,
      right,
      head,
      moveAbleList
    };
  }

  function directionHelper(headObj, food, id){
    const head = headObj.head;
    let newHead = {};

    //to right
    if(head.x > food.x){
      if(!!headObj['left']){
        newHead = headObj['left'];
      }
    }
    //to left
    if(head.x < food.x){
      if(!!headObj['right']){
        newHead = headObj['right'];
      }
    }
    //to up
    if(head.y > food.y){
      if(!!headObj['up']){
        newHead = headObj['up'];
      }
    }
    //to down
    if(head.y < food.y){
      if(!!headObj['down']){
        newHead = headObj['down'];
      }
    }
    if(`X${head.x}Y${head.y}` === `X${food.x}Y${food.y}`){
      const moveAbleList = headObj.moveAbleList;
      const randomIdx = Math.floor(Math.random() * moveAbleList.length);
      newHead = moveAbleList[randomIdx];
    }

    if(!newHead.isAbleToMove){
      const moveAbleList = findNear(id).moveAbleList;
      const randomIdx = Math.floor(Math.random() * moveAbleList.length);
      newHead = moveAbleList[randomIdx];
    }

    return newHead;
  }

  function drawSquare(spot, size, color){
    ctx.fillStyle = color || spot.color || '#000';
    ctx.fillRect(spot.x, spot.y, size, size);
  }

  function drawInitialSnake(state){
    state.snakes.forEach(eachSnakePart => drawSquare(eachSnakePart, size));
    return state;
  }

  function drawInitialFood(state){
    drawSquare(state.food, size);
    return state;
  }

  function drawClearScreen(){
    drawSquare({
      x:0,
      y:0
    }, canvas.width, '#fff');
  }

  function drawSnake(id){
    return function(){
      _state.snakePool[id].body.forEach(eachSnakePart => drawSquare(eachSnakePart, size));
    }
  }

  function drawFood(){
    drawSquare(_state.food, size);
  }

  function moveByUser(id){
    window.addEventListener('keydown', function(event){
      const direction = directionKeyMap[event.keyCode] || '';
      _state.snakePool[id].directionQueue = direction;
    });
    _state.snakePool[id].mevement = setInterval(function(){
      if(directionQueue !== ''){
        const newHead = findNear(id)[ _state.snakePool[id].directionQueue];
        const targetSnake = _state.snakePool[id].body;
        const newTail = targetSnake[targetSnake.length - 1];

        // 충돌감지
        if(newHead && (newHead.isAbleToMove || !newHead.hasObject)){
          newHead.hasObject = true;
          newHead.isAbleToMove = false;
          newHead.color = _state.snakePool[id].body[0].color;
        }else{
          clearInterval(_state.snakePool[id].mevement);
          console.log(id+' GAME OVER');
          return;
        }

        // 음식과 부딛혔을경우
        if(`X${newHead.x}Y${newHead.y}` === `X${_state.food.x}Y${_state.food.y}`){
          snakeGame.setState('update-eat', createFood('green')(_state));
        }else{
          newTail.hasObject = false;
          newTail.isAbleToMove = true;
          newTail.color = '#fff';
          targetSnake.pop();
        }

        // 이동
        targetSnake.unshift(newHead);
        snakeGame.setState('update-move', { snakes:getSnakes() });
      }
    }, _state.fps);
  }

  function moveByAI(id){
    _state.snakePool[id].movement = setInterval(function(){
      const newHead = directionHelper(findNear(id), _state.food, id);
      const targetSnake = _state.snakePool[id].body;
      const newTail = targetSnake[targetSnake.length - 1];

      // 충돌감지
      if(newHead && (newHead.isAbleToMove || !newHead.hasObject)){
        newHead.hasObject = true;
        newHead.isAbleToMove = false;
        newHead.color = _state.snakePool[id].body[0].color;
      }else{
        clearInterval(_state.snakePool[id].movement);
        console.log(id+'GAME OVER');
        return;
      }

      // 음식과 부딛혔을경우
      if(`X${newHead.x}Y${newHead.y}` === `X${_state.food.x}Y${_state.food.y}`){
        snakeGame.setState('update-eat', createFood('green')(_state));
      }else{
        newTail.hasObject = false;
        newTail.isAbleToMove = true;
        newTail.color = '#fff';
        targetSnake.pop();
      }

      // 이동
      targetSnake.unshift(newHead);
      snakeGame.setState('update-move', { snakes:getSnakes() });
    }, _state.fps);
  }

})(window.M);