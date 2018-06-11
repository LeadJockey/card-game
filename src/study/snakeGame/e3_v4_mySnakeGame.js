(function(exports){
  'use strict';
  const Structure = function(presetState){
    this.listeners = {};
    this.state = presetState || {};
  };
  Structure.prototype.on = function(type, callback){
    if(!this.listeners[type]){
      this.listeners[type] = callback;
    }
  };
  Structure.prototype.trigger = function(type){
    if(!this.listeners[type]){
      return;
    }
    this.listeners[type].call(this, type);
  };
  Structure.prototype.setState = function(type, newState){
    Object.assign(this.state, newState);
    this.trigger(type);
  };
  Structure.prototype.renderedBy = function(type){
    const that = this;
    return function(){
      const args = Array.prototype.slice.call(arguments);
      that.on(type, function(){
        args.forEach(function(fn){
          fn();
        });
      });
    }
  };

  const Pipeline = function(presetStages){
    this.stages = presetStages || [];
  };
  Pipeline.prototype.pipe = function(next){
    this.stages.push(next);
    return this;
  };
  Pipeline.prototype.process = function(data){
    let output = data || function(data){};
    this.stages.forEach(function(stage, count){
      output = stage(output);
    });
    return output;
  };

  exports.M = {};
  exports.M.Structure = Structure;
  exports.M.Pipeline = Pipeline;
})(window);

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
  const size = canvas.width / 10; // 50

  const presetState = {
    map:[],
    snakes:[],
    food:{}
  };
  const snakeGame = new _.Structure(presetState);
  const _state = snakeGame.state;
  const snakePool = {
    user:[13, 14, 15, 16, 17],
    ai:[86, 85, 84, 83, 82],
  };

  //init
  //initialize pipeline process(state)
  init();
  // on Events - rending UI
  // key Event
  // grow Event
  // move Event
  // crash Event
  // trig Events - event trigger
  // key Event
  // grow Event
  // move Event
  // crash Event

  function init(){
    const initialize = new _.Pipeline();
    initialize.pipe(createMap)
              .pipe(createSnake('user','yellow'))
              .pipe(createSnake('ai','green'))
              .pipe(createFood('pink'))
              .pipe(drawInitialSnake)
              .pipe(drawInitialFood)
              .process(_state);
    console.log(snakeGame);
    console.log(snakePool);
  }
  snakeGame.renderedBy('update-move')(
    drawSnake('user'),
    drawSnake('ai')
  );
  moveBy('user');
  moveBy('ai');

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
  function createSnake(id,color){
    return function(state){
      const snake = [];
      snakePool[id].forEach((index) =>{
        const eachSnakePart = _state.map[index];
        eachSnakePart.hasObject = true;
        eachSnakePart.isAbleToMove = false;
        eachSnakePart.color = color || '#000';
        state.snakes.push(eachSnakePart);
        snake.push(eachSnakePart);
        snakePool[id] = snake;
      });
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
      return state;
    }
  }

  function drawSquare(spot, size, color){
    ctx.fillStyle = color || spot.color || '#000';
    ctx.fillRect(spot.x, spot.y, size, size);
  }
  function drawInitialSnake(state){
    state.snakes.forEach(eachSnakePart =>drawSquare(eachSnakePart,size));
    return state;
  }
  function drawInitialFood(state){
    drawSquare(state.food,size);
    return state;
  }
  function drawSnake(id){
    return function(){
      snakePool[id].forEach(eachSnakePart =>drawSquare(eachSnakePart,size));
    }
  }
  function drawFood(){
    drawSquare(_state.food,size);
  }

  function moveBy(id){
    window.addEventListener('keydown', function(event){
      const direction = directionKeyMap[event.keyCode] || '';
      if(direction !== ''){
        const newHead = findNear(id)[direction];
        newHead.hasObject = true;
        newHead.isAbleToMove = false;
        newHead.color = snakePool[id][0].color;
        snakePool[id].unshift(newHead);
        console.log(snakePool);
        snakeGame.setState('update-move',{});
      }
    });
  }

  function findNear(id){
    const head = snakePool[id][0];
    let up = null;
    let down = null;
    let left = null;
    let right = null;

    _state.map.forEach((spot)=>{
      //up
      if((spot.x === head.x) && (spot.y === head.y - size)){
        up = spot;
      }
      //down
      if((spot.x === head.x) && (spot.y === head.y + size)){
        down = spot;
      }
      //left
      if((spot.y === head.y) && (spot.x === head.x - size)){
        left = spot;
      }
      //right
      if((spot.y === head.y) && (spot.x === head.x + size)){
        right = spot;
      }
    });

    return { up,down,left,right };
  }





})(window.M);