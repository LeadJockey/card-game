// module
var Pipeline = function(presetStages){
  this.stages = presetStages || [];
};

Pipeline.prototype.pipe = function(next){
  this.stages.push(next);
  return this;
};
Pipeline.prototype.process = function(data){
  var output = data || function(data){};
  this.stages.forEach(function(stage, count){
    output = stage(output);
  });
  return output;
};

(function($, Pipeline){
  'use strict';
  //test
  var tick = 0;


  // elem
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var score = document.getElementById('score');
  var startBtn = document.getElementById('startBtn');
  var aiBtn = document.getElementById('aiBtn');
  // state
  var state = {
    objSize:20,
    fps:100,
    snakeColor:'#DB3079',
    foodColor:'#97E4FF',
    snakes:['X100|Y20', 'X80|Y20', 'X60|Y20', 'X40|Y20|L1|O1', 'X20|Y20'],
    snakesQueue:['X100|Y20', 'X80|Y20', 'X60|Y20', 'X40|Y20', 'X20|Y20'],
    locations:[], // X10|Y10
    direction:'',
    directionQueue:'right',
    score:0,
    food:'X100|Y100',
    head:'X100|Y20',
    tail:'X20|Y20',
    isCrash:false
  };
  // map
  var keyMap = {
    37:'left',
    38:'up',
    39:'right',
    40:'down'
  };
  var reverseDirectionMap = {
    'right':'left',
    'left':'right',
    'up':'down',
    'down':'up'
  };

  var ai = {
    isAi:false,
    directions:['right', 'down', 'up'],
    movement:function(){}
  };
  var user = {
    movement:function(){}
  };


  init();

  function init(){
    var createProcess = new Pipeline();

    // UI rending
    render(
      clearScreen(),
      drawSnake(),
      drawFood(),
      drawScore()
    );

    // State initialize processing
    createProcess.pipe(createLocation)
                 .pipe(createFood)
                 .pipe(setState);
    createProcess.process(state);

    // Event binding
    bindEvents();
  }

  // events
  function bindEvents(){

    window.addEventListener('keydown', function(event){
      var direction = keyMap[event.keyCode] || '';
      if(state.direction !== direction && direction !== ''){
        clearInterval(user.movement);
        user.movement = setInterval(frame(direction), state.fps);
      }
    });

    startBtn.addEventListener('click', function(){
      user.movement = setInterval(frame(state.direction), state.fps);
    });

    aiBtn.addEventListener('click', function(){
      var flag = ai.isAi;
      ai.isAi = !flag;
      ai.movement = setInterval(frame(ai.directions[Math.floor(Math.random() * ai.directions.length)]), state.fps);
    });

  }

  //process
  function onDinner(stateObj){
    var result = $.extend({}, stateObj);

    // onCrash
    if(state.food === result.head){
      result.food = createFood(result).food; // create food
      result.snakes.push(result.tail); // grow snake
      result.score += result.objSize; // change score
    }

    return result;
  }

  function onMove(stateObj){
    var result = $.extend({}, stateObj);
    var direction = result.direction || '';
    var snakesQueue = result.snakes;
    var head = result.head;
    var size = result.objSize;
    var headX = parseLocationToInt(head, 'X');
    var headY = parseLocationToInt(head, 'Y');
    var newHead = '';
    var newTail = '';
    var newSnakes = [];

    // movement engine
    if(direction === 'right'){
      headX += size;
    }else if(direction === 'down'){
      headY += size;
    }else if(direction === 'left'){
      headX -= size;
    }else if(direction === 'up'){
      headY -= size;
    }

    // set newState and pass to next function
    newHead = parseIntToLocation(headX, headY);
    newSnakes = copyArray(result.snakes);
    newSnakes.unshift(newHead);
    newTail = newSnakes[newSnakes.length - 1];
    newSnakes.pop();

    result.head = newHead;
    result.tail = newTail;
    result.snakes = newSnakes;
    result.sankesQueue = snakesQueue;

    return result;
  }

  function onCrash(stateObj){
    var result = $.extend({}, stateObj);
    var locations = result.locations;
    var snakes = result.snakes;
    var tmpHeads = [result.head];
    var isOutOfRange = (locations.length - tmpHeads.length) !== difference(locations, tmpHeads).length;
    var isCrashSelf = (snakes.length - tmpHeads.length) !== difference(snakes, tmpHeads).length;

    if(isOutOfRange || isCrashSelf){
      result.isCrash = true;
      result.snakes = result.snakesQueue;
      result.head = result.snakesQueue[0];
      result.tail = result.snakesQueue[result.snakesQueue.length - 1];
      console.log('CRASHED : GAME OVER');
      clearInterval(user.movement);
    }else{
      result.snakesQueue = result.snakes;
      result.isCrash = false;
    }

    if(ai.isAi){
      var nextDirections = [];
      var size = result.objSize;

      var right = parseIntToLocation(parseLocationToInt(result.head, 'X') + size, parseLocationToInt(result.head, 'Y'));
      var left = parseIntToLocation(parseLocationToInt(result.head, 'X') - size, parseLocationToInt(result.head, 'Y'));
      var down = parseIntToLocation(parseLocationToInt(result.head, 'X'), parseLocationToInt(result.head, 'Y') + size);
      var up = parseIntToLocation(parseLocationToInt(result.head, 'X'), parseLocationToInt(result.head, 'Y') - size);
      console.log(search(result.snakes, right));

      if(!search(result.snakes, right)
        && (parseLocationToInt(result.head, 'X') + size) <= (canvas.width - size)
        && (parseLocationToInt(result.food,'X') >= ((parseLocationToInt(result.head, 'X') + size)))
      ){
        nextDirections.push('right');
      }else if(!search(result.snakes, left)
        && (parseLocationToInt(result.head, 'X') - size) >= 0
        && (parseLocationToInt(result.food,'X') <= ((parseLocationToInt(result.head, 'X') - size)))
      ){
        nextDirections.push('left');
      }else if(!search(result.snakes, down)
        && (parseLocationToInt(result.head, 'Y') + size) <= (canvas.height + size)
        && (parseLocationToInt(result.food, 'Y') >= ((parseLocationToInt(result.head, 'Y') + size)))
      ){
        nextDirections.push('down');
      }else if(!search(result.snakes, up)
        && (parseLocationToInt(result.head, 'Y') - size) >= 0
        && (parseLocationToInt(result.food, 'Y') <= ((parseLocationToInt(result.head, 'Y') - size)))
      ){
        nextDirections.push('up');
      }else if(!(isOutOfRange || isCrashSelf)){
        nextDirections = [result.direction];
      }

      clearInterval(ai.movement);
      ai.directions = difference(nextDirections, [reverseDirectionMap[result.direction]]);
      ai.movement = setInterval(frame(ai.directions[Math.floor(Math.random() * ai.directions.length)]), result.fps);
      if(result.isCrash){
        clearInterval(ai.movement);
      }
      // if(tick > 500){
      //   clearInterval(ai.movement);
      // }
    }

    return result;
  }

  //frame - animate
  function frame(direction){
    return function(){
      var updateProcess = new Pipeline();
      var preset = {
        directionQueue:state.direction,
        direction:direction
      };
      if(direction !== ''){
        updateProcess.pipe(onMove)
                     .pipe(onDinner)
                     .pipe(onCrash)
                     .pipe(setState);
        updateProcess.process($.extend(state, preset));
        tick++;
        console.log(tick);
      }
    };
  }

  //create
  function createLocation(stateObj){
    console.log('creating location ... ');
    var result = $.extend({}, stateObj);
    var size = state.objSize;
    var xLength = Math.ceil((canvas.width - size) / size);
    var yLength = Math.ceil((canvas.height - size) / size);

    for(var x = 0; x <= xLength; x++){
      for(var y = 0; y <= yLength; y++){
        result.locations.push(parseIntToLocation(x * size, y * size));
      }
    }

    return result;
  }

  function createFood(stateObj){
    console.log('creating food ... ');
    var result = $.extend({}, stateObj);
    var foodLocations = difference(result.locations, result.snakes);
    var randomIdx = Math.floor(Math.random() * foodLocations.length);

    result.food = foodLocations[randomIdx];
    return result;
  }

  // set
  function setState(newSate){
    $.extend(state, newSate);
    $(state).trigger('state:updated');
    // console.table(state);
  }

  // render
  function render(){
    var args = copyArray(arguments);
    $(state).on('state:updated', function(){
      args.forEach(function(func){
        func();
      });
    });
  }

  // utils
  function parseLocationToInt(location, type){
    //location format == ex) X20|Y20
    var locationParts = location.split('|');
    if(type === 'X'){
      var xString = locationParts[0];
      return parseInt(xString.replace(type, ''), 10);
    }
    if(type === 'Y'){
      var yString = locationParts[1];
      return parseInt(yString.replace(type, ''), 10);
    }
  }

  function parseIntToLocation(x, y){
    return 'X' + x + '|Y' + y;
  }

  function copyArray(array){
    return Array.prototype.slice.call(array);
  }

  function difference(bases, compares){
    var b = copyArray(bases);
    var c = copyArray(compares);
    return b.filter(function(value){
      return c.indexOf(value) < 0;
    });
  }

  function search(array, target){
    var arr = copyArray(array);
    var length = arr.length;
    var result = false;
    for(var v=0; v <length; v++){
      if(arr[v].indexOf(target) > -1){
        result = true;
        break;
      }
    }
    return result;
  }

  // draw
  function drawSquare(x, y, size, color, text){
    var txt = text || '';
    return function(){
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
      if(txt !== ''){
        ctx.fillStyle = 'black';
        ctx.fillText(txt, x + 7, y + 14, x);
      }
    }
  }

  function drawSnake(){
    return function(){
      state.snakes.forEach(function(part){
        drawSquare(
          parseLocationToInt(part, 'X'),
          parseLocationToInt(part, 'Y'),
          state.objSize,
          state.snakeColor
        )();
      });
    };
  }

  function drawFood(){
    return function(){
      drawSquare(
        parseLocationToInt(state.food, 'X'),
        parseLocationToInt(state.food, 'Y'),
        state.objSize,
        state.foodColor
      )();
    }
  }

  function drawScore(){
    return function(){
      score.innerText = state.score;
    }
  }

  function clearScreen(){
    return function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }

})(jQuery, Pipeline);