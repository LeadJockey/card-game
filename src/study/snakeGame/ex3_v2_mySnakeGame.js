(function($){
  'use strict';

  // elem
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var score = document.getElementById('score');
  // state
  var state = {
    objSize:20,
    snakeColor:'#DB3079',
    foodColor:'#97e4ff',
    snakes:['X20|Y20', 'X40|Y20', 'X60|Y20', 'X80|Y20', 'X100|Y20'],
    locations:[], // X10|Y10
    score:20,
    direction:'',
    food:'X100|Y100',
    head:'X100|Y20',
    tick:0
  };
  // map
  var keyMap = {
    37:'right',
    38:'down',
    39:'left',
    40:'up'
  };


  render(
    clearScreen(),
    drawSnake(),
    drawFood(),
    drawScore()
  );
  bindEvents();


  function Game(){

  }

  // initialize
  function init(){

  }


  // events
  function bindEvents(){
    window.addEventListener('keydown', function(event){
      var direction = keyMap[event.keyCode] || '';
      if(direction === ''){
        setState($.extend(
          onMoveTo(direction),
          onCrash()
        ));
      }
    });
  }

  function onCrash(){
    return state.food === state.head ? { food:'' }:{};
  }

  function onMoveTo(direction){
    var head = state.head;
    var size = state.objSize;
    var headX = parseLocationToInt(head, 'X');
    var headY = parseLocationToInt(head, 'Y');
    var newHead = '';
    var newSnakes = [];

    if(direction === 'right'){
      headX -= size;
    }else if(direction === 'down'){
      headY -= size;
    }else if(direction === 'left'){
      headX += size;
    }else if(direction === 'up'){
      headY += size;
    }

    newHead = parseIntToLocation(headX, headY);
    newSnakes = Array.prototype.slice.call(state.snakes).concat([newHead]);
    newSnakes.shift();
    return {
      direction:direction,
      head:newHead,
      snakes:newSnakes
    };
  }


  // set
  function setState(newSate){
    $.extend(state, newSate);
    $(state).trigger('state:updated');
    console.table(state);
  }

  // render
  function render(){
    var args = Array.prototype.slice.call(arguments);
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


  // draw
  function drawSquare(x, y, size, color){
    return function(){
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
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


})(jQuery);