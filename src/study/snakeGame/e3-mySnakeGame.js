(function(){
  'use strict';

  var defaultOpts = {
    BONE_SIZE:20,
    SNAKE_COLOR:'#DB3079',
    FOOD_COLOR:'#97e4ff',
    canvas:document.getElementById('canvas'),
    score:document.getElementById('score'),
    ctx:document.getElementById('canvas').getContext('2d'),
    snakeLength:5,
    snakeBones:[],
    coordinate:{
      xList:[],
      yList:[]
    },
    direction:'',
    isAbleToMove:false,
    isAbleToEat:false,
    totalScore:0,
    food:{
      x:100,
      y:100
    },
    head:{
      x:0,
      y:0
    }
  };

  var KEYCODE_DIRECTION_MAP = {
    37:'right',
    38:'down',
    39:'left',
    40:'up'
  };
  var REVERSE_DIRECTION_MAP = {
    'right':'left',
    'down':'up',
    'left':'right',
    'up':'down'
  };

  var SnakeGame = function(opts){
    this.opts = Object.assign({}, defaultOpts, opts || {});
  };

  // method - initialize
  SnakeGame.prototype.startGame = function(){
    var that = this;

    // initial process
    that.createCoordinateSystem().createSnake().drawSnake();

    window.addEventListener('keydown', function(evt){
      var direction = KEYCODE_DIRECTION_MAP[evt.keyCode] || '';

      // clear screen
      that.drawClearScreen();
      // moving process
      that.isAbleToMove(direction).moveTo(direction).drawSnake();
      // eating process
      that.isAbleToEat().createFood().drawFood().drawScore();

    });

  };

  // method - create
  SnakeGame.prototype.createSnake = function(){
    console.log('Snake : creating . . . ');
    this.opts.snakeBones = [];
    for(var i = this.opts.snakeLength; i > 0; i--){
      this.opts.snakeBones.push({
        x:i * this.opts.BONE_SIZE,
        y:0
      });
    }
    console.log('done', this.opts.snakeBones);
    return this;
  };
  SnakeGame.prototype.createCoordinateSystem = function(){
    console.log('CoordinateSystem : creating . . . ');
    var scale = this.opts.BONE_SIZE;
    var range = this.opts.canvas.width - scale;
    for(var i = 0; i <= range; i += scale){
      this.opts.coordinate.xList.push(i);
      this.opts.coordinate.yList.push(i);
    }
    console.log('done', this.opts.coordinate);
    return this;
  };
  SnakeGame.prototype.createFood = function(){
    // 음식 생성 기준
    if(!this.opts.isAbleToEat){
      return this;
    }


    var ableToPutXList = this.opts.coordinate.xList.slice();
    var ableToPutYList = this.opts.coordinate.yList.slice();

    // 전체 좌표계에서 스네이크의 좌표값 빼기
    this.opts.snakeBones.forEach(function(bone){
      ableToPutXList = ableToPutXList.filter(function(x){return x !== bone.x;});
      ableToPutYList = ableToPutYList.filter(function(y){return y !== bone.y;});
    });

    // 리스트에서 랜덤으로 하나를 뽑아 반환
    var randomFoodX = Math.floor(Math.random() * ableToPutXList.length);
    var randomFoodY = Math.floor(Math.random() * ableToPutYList.length);

    this.opts.food = { x:ableToPutXList[randomFoodX], y:ableToPutYList[randomFoodY] };

    return this;
  };

  // method - draw
  SnakeGame.prototype.drawClearScreen = function(){
    var C_W = this.opts.canvas.width;
    var C_H = this.opts.canvas.height;
    this.opts.ctx.clearRect(0, 0, C_W, C_H);
  };
  SnakeGame.prototype.drawSquare = function(x, y, size, color){
    this.opts.ctx.fillStyle = color;
    this.opts.ctx.fillRect(x, y, size, size);
    return this;
  };
  SnakeGame.prototype.drawSnake = function(){
    var that = this;

    that.opts.snakeBones.forEach(function(bone){
      that.drawSquare(bone.x, bone.y, that.opts.BONE_SIZE, that.opts.SNAKE_COLOR);
    });

    return this;
  };
  SnakeGame.prototype.drawFood = function(){
    if(!this.opts.isAbleToEat){
      this.drawSquare(this.opts.food.x, this.opts.food.y, this.opts.BONE_SIZE, this.opts.FOOD_COLOR);
    }
    return this;
  };
  SnakeGame.prototype.drawScore = function(){
    this.opts.score.innerText = this.opts.totalScore;
    return this;
  };

  // method - checker
  SnakeGame.prototype.isAbleToMove = function(direction){
    var reverseDirection = REVERSE_DIRECTION_MAP[direction] || '';

    if(this.opts.direction === reverseDirection){
      console.log('you can not move to ' + reverseDirection);
      this.opts.isAbleToMove = false;
      return this;
    }else{
      this.opts.direction = direction;
      this.opts.isAbleToMove = true;
    }

    return this;
  };
  SnakeGame.prototype.isAbleToEat = function(){
    this.opts.isAbleToEat = (this.opts.head.x === this.opts.food.x) && (this.opts.head.y === this.opts.food.y);
    if(this.opts.isAbleToEat){
      // 점수 증가
      this.opts.totalScore += this.opts.BONE_SIZE;
      console.log('snake growth level :', this.opts.snakeBones.length);
    }
    return this;
  };


  // method - engine
  SnakeGame.prototype.moveTo = function(direction){
    if(!this.opts.isAbleToMove){
      return this;
    }
    var head = this.opts.snakeBones[0];
    var headX = head.x;
    var headY = head.y;

    // movement handler
    if(direction === 'right'){
      headX -= this.opts.BONE_SIZE;
    }else if(direction === 'down'){
      headY -= this.opts.BONE_SIZE;
    }else if(direction === 'left'){
      headX += this.opts.BONE_SIZE;
    }else if(direction === 'up'){
      headY += this.opts.BONE_SIZE;
    }else{
      return this;
    }

    // movement handler -> new head setting
    this.opts.head = {
      x:headX,
      y:headY
    };
    this.opts.snakeBones.unshift(this.opts.head);

    // 성장 억제 - growth control
    if(!this.opts.isAbleToEat){
      this.opts.snakeBones.pop();
    }

    return this;
  };

  // external execute level
  var game = new SnakeGame();

  game.startGame();


})();