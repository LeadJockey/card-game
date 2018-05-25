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
    snakes:['X100|Y20', 'X80|Y20', 'X60|Y20', 'X40|Y20', 'X20|Y20'],
    snakesQueue:['X100|Y20', 'X80|Y20', 'X60|Y20', 'X40|Y20', 'X20|Y20'],
    headings:[],
    locations:[], // X10|Y10
    searches:[], // X10|Y10|S1
    direction:'right',
    score:0,
    food:'X100|Y100',
    head:'X100|Y20',
    tail:'X20|Y20'
  };
  // map
  var keyMap = {
    37:'left',
    38:'up',
    39:'right',
    40:'down'
  };

  var ai = {
    directions:['left', 'right', 'down', 'up'],
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
      drawScore(),
      drawSearchingHelper()
    );

    // State initialize processing
    createProcess.pipe(createLocation)
                 .pipe(createHeadings)
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
      // if(state.direction !== direction && direction !== ''){
      //   clearInterval(user.movement);
      //   user.movement = setInterval(frame(direction), state.fps);
      // }
      console.log(state.headings);
      frame(direction)();
    });

    startBtn.addEventListener('click', function(){
      user.movement = setInterval(frame(state.direction), state.fps);
    });

    aiBtn.addEventListener('click', function(){
      console.log('dir', Math.floor(Math.random() * ai.directions.length));
      ai.movement = setInterval(frame(function(){
        var random = Math.floor(Math.random() * ai.directions.length);

        frame(ai.directions[random]);
      }), state.fps);
    })


    // ai test
    // ai.movement = setInterval(function(){
    //   var headingLocations = difference(state.locations, state.snakes);
    //   var randomIdx = Math.floor(Math.random() * headingLocations.length);
    //
    //   var direction = ai.directions[Math.floor(Math.random() * ai.directions.length)];
    //   var updateProcess = new Pipeline();
    //   var preset = { direction:direction };
    //
    //     updateProcess.pipe(onMove)
    //                  .pipe(onDinner)
    //                  .pipe(onCrash)
    //                  .pipe(setState);
    //     updateProcess.process($.extend(state, preset));
    // }, state.fps);
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
    // result.headingOptions = [
    //   parseIntToLocation(headX+size, headY),
    //   parseIntToLocation(headX, headY+size),
    //   parseIntToLocation(headX-size, headY),
    //   parseIntToLocation(headX, headY+size)
    // ];

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
      result.snakes = result.snakesQueue;
      result.head = result.snakesQueue[0];
      result.tail = result.snakesQueue[result.snakesQueue.length - 1];
      console.log('GAME OVER');
      clearInterval(user.movement);
      clearInterval(ai.movement);
    }else{
      result.snakesQueue = result.snakes;
    }

    return result;
  }

  //frame - animate
  function frame(direction){
    return function(){
      var updateProcess = new Pipeline();
      var preset = { direction:direction };
      if(direction !== ''){
        updateProcess.pipe(onMove)
                     .pipe(createHeadings)
                     .pipe(onDinner)
                     .pipe(onCrash)
                     .pipe(setState);
        updateProcess.process($.extend(state, preset));
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

  function createSearchingHelper(stateObj){
    console.log('creating searching helper ... ');
    var result = $.extend({}, stateObj);

    return result;
  }

  function createHeadings(stateObj){
    console.log('creating headings ... ');
    var result = $.extend({}, stateObj);
    var head = result.head;
    var size = result.objSize;
    var rangeW = canvas.width - size;
    var rangeY = canvas.height - size;
    var headX = parseLocationToInt(head, 'X');
    var headY = parseLocationToInt(head, 'Y');
    var positiveX = headX + size;
    var negativeX = headX - size;
    var positiveY = headY + size;
    var negativeY = headY - size;
    var headingOptions = [
      // parseIntToSearchHelper(positiveX, headY, 1), //right square
      // parseIntToSearchHelper(negativeX, headY, 1), //left square
      // parseIntToSearchHelper(headX, positiveY, 1), //up square
      // parseIntToSearchHelper(headX, negativeY, 1)  //down square
    ];

    function getRightOrder(){
      var headingOptions = [];
      var lv = 1;
      for(var right = headX+size; right <= rangeW; right+=size){
        headingOptions.push(parseIntToSearchHelper(right, headY, lv++));
      }
      return headingOptions;
    }
    function getLeftOrder(){
      var headingOptions = [];
      var lv = 1;
      for(var left = headX-size; left >= size; left-=size){
        headingOptions.push(parseIntToSearchHelper(left, headY, lv++));
      }
      return headingOptions;
    }

    // for(var left = headX-size; right >= 0; right-=size){
    //   headingOptions.push(parseIntToSearchHelper(right, headY, (rangeW-right)/size))
    // }



    result.headings = headingOptions.concat(
      getRightOrder(),
      getLeftOrder()
    );

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

  function parseSearchHelperToInt(searchHelper, type){
    // search format == ex) X10|Y10|S10
    var searchParts = searchHelper.split('|');
    if(type === 'X'){
      var xString = searchParts[0];
      return parseInt(xString.replace(type, ''), 10);
    }
    if(type === 'Y'){
      var yString = searchParts[1];
      return parseInt(yString.replace(type, ''), 10);
    }
    if(type === 'S'){
      var sString = searchParts[2];
      return parseInt(sString.replace(type, ''), 10);
    }
  }

  function parseIntToSearchHelper(x, y, s){
    return 'X' + x + '|Y' + y + '|S' + s;
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

  function drawSearchingHelper(){
    return function(){
      state.headings.forEach(function(headAround){
        drawSquare(
          parseSearchHelperToInt(headAround, 'X'),
          parseSearchHelperToInt(headAround, 'Y'),
          state.objSize,
          '#EFEFEF',
          parseSearchHelperToInt(headAround, 'S').toString()
        )();

      });
    }
  }

  function clearScreen(){
    return function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }

})(jQuery, Pipeline);