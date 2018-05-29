(function($, module){
  'use strict';

  //--- declare - elements ---//
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const score = document.getElementById('score');
  const startBtn = document.getElementById('startBtn');
  const aiBtn = document.getElementById('aiBtn');

  const state = {
    snakePool:[
      {
        id:'shawn',
        color:'pink',
        body:[
          {
            x:100,
            y:0
          }, {
            x:80,
            y:0
          }, {
            x:60,
            y:0
          }
        ]
      },
      {
        id:'bang',
        color:'red',
        body:[
          {
            x:60,
            y:60
          }, {
            x:60,
            y:80
          }, {
            x:60,
            y:100
          }
        ]
      }
    ],
    size:20,
    food:{
      x:200,
      y:200,
      color:'blue'
    }
  };
  let i = 0;
  const EVENT_MAP = {
    state:{
      updated:'state:updated'
    },
    click:'click'
  };

  function Snake(opts){
    this.colorTypes = ['orange', 'yellow', 'chocolate', 'gold', 'pink'];

    this.opts = opts || {};
    this.state = {
      id:this.opts.id,// must need
      color: this.colorTypes[Math.floor(Math.random() * this.colorTypes.length)],
      body: this.opts.body || []
    };

    //options
    this.size = this.opts.size || 20;
    this.startPointY = this.opts.startPointY || 20;
    this.startPointX = this.opts.startPointX || 20;
    this.startLength = this.opts.startLength || 3;
    this.headingType = this.opts.headingType || 'Y_FIX';

    this.create();
  }

  Snake.prototype.create = function(){
    const length = (this.startLength * this.size) +1;

    if(this.headingType === 'Y_FIX'){
      for(let x = this.startPointX; x < length; x += this.size){
        this.state.body.push({
          x:x,
          y:this.startPointY
        });
      }
    }

    if(this.headingType === 'X_FIX'){
      for(let y = this.startPointY; y < length; y += this.size){
        this.state.body.push({
          x:this.startPointX
        });
      }
    }

    return this;
  };



  const s1 = new Snake({
    id:'shawn-test'
  });
  console.log(s1);

  //--- execute ---//
  init();

  //--- functions - structure : patterns ---//
  function init(){
    const process = new module.Pipeline();
    process.pipe(testState);
    process.process(state);

    $(state).on(EVENT_MAP.state.updated, exe(drawFood));
    aiBtn.addEventListener(EVENT_MAP.click, exe(drawAllSnakes, createFood));
  }

  function setState(newState){
    $.extend(state, newState);
    $(state).trigger(EVENT_MAP.state.updated);
    console.table(state);
  }

  function exe(){
    const args = Array.prototype.slice.call(arguments);
    return () =>{
      args.forEach(fn => fn());
    }
  }

  function testState(state){
    state.i = i++;
    return setState(state);
  }

  function test(){
    console.log('test', i++);
  }

  //--- functions - events ---//
  // 벽 크레쉬
  // 셀프 크레쉬
  // 아더 크레쉬
  // 음식 크레쉬

  //--- functions - draw ---//

  function createFood(){
    const newFood = {
      x:Math.floor(Math.random() * canvas.width - state.size),
      y:Math.floor(Math.random() * canvas.height - state.size)
    };
    setState($.extend(state.food, newFood));
  }

  function drawSquare(x, y, size, color){
    ctx.fillStyle = color || 'black';
    ctx.fillRect(x, y, size, size);
  }

  function drawSnake(snake){
    snake.body.forEach(part => drawSquare(part.x, part.y, state.size, snake.color));
  }

  function drawFood(){
    drawSquare(state.food.x, state.food.y, state.size, state.food.color);
  }

  function drawAllSnakes(){
    state.snakePool.forEach(snake => drawSnake(snake));
  }


})(jQuery, window.M);