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
    coordinates:[],
    direction:'',
    isAbleToMove:false,
    isAbleToEat:false,
    totalScore:0,
    food:{
      x:0,
      y:0
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
    // initial process
    this.createCoordinateSystem().createSnake().drawSnake().on();
  };

  // method - on
  SnakeGame.prototype.on = function(){
    var that = this;
    window.addEventListener('keydown', function(evt){
      var direction = KEYCODE_DIRECTION_MAP[evt.keyCode] || '';
      that.drawClearScreen() // clear screen
          .isAbleToMove(direction, that.moveTo.bind(that)).drawSnake() // moving process
          .isAbleToEat(that.createFood.bind(that)).drawFood().drawScore(); // eating process
    });
  };

  // method - private
  SnakeGame.prototype._getIndexArray = function(length){
    var indexArray = [];
    for(var i=0; i < length; i++){
      indexArray.push(i);
    }
    return indexArray;
  };
  SnakeGame.prototype._mapToList = function(map){
    return map.map(function(obj){
      var result = '';
      for(var prop in obj){
        if(obj.hasOwnProperty(prop)){
          result += prop.toUpperCase() + obj[prop];
        }
      }
      return result;
    });
  };

  // method - create
  SnakeGame.prototype.createSnake = function(){
    console.log('Snake : creating . . . ');

    var that = this;

    that.opts.snakeBones = [];
    that._getIndexArray(that.opts.snakeLength).forEach(function(i){
      that.opts.snakeBones.push({ x:i * that.opts.BONE_SIZE, y:0 });
    });

    console.log('done', that.opts.snakeBones);
    return this;
  };
  SnakeGame.prototype.createCoordinateSystem = function(){
    console.log('CoordinateSystem : creating . . . ');

    var that = this;
    var scale = that.opts.BONE_SIZE;
    var range = that.opts.canvas.width - scale;
    var xList = [];
    var yList = [];

    for(var i = 0; i <= range; i += scale){
      xList.push(i);
      yList.push(i);
    }

    xList.forEach(function(x){
      yList.forEach(function(y){
        that.opts.coordinates.push('X' + x + 'Y' + y);
      })
    });

    console.log('done', that.opts.coordinates);
    return this;
  };
  SnakeGame.prototype.createFood = function(){
    var ableToCreateFoodList = this._mapToList(this.opts.snakeBones);
    var randomIdx = Math.floor(Math.random() * ableToCreateFoodList.length);

    this.opts.food = ableToCreateFoodList[randomIdx];
    return this;
  };

  // method - draw
  SnakeGame.prototype.drawClearScreen = function(){
    var C_W = this.opts.canvas.width;
    var C_H = this.opts.canvas.height;
    this.opts.ctx.clearRect(0, 0, C_W, C_H);
    return this;
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
    if(this.opts.isAbleToEat){
      return this;
    }
    console.log('food xy : ', this.opts.food.x + ':' + this.opts.food.y);
    this.drawSquare(this.opts.food.x, this.opts.food.y, this.opts.BONE_SIZE, this.opts.FOOD_COLOR);
    return this;
  };
  SnakeGame.prototype.drawScore = function(){
    this.opts.score.innerText = this.opts.totalScore;
    return this;
  };

  // method - checker
  SnakeGame.prototype.isAbleToMove = function(direction, moveToFunc){
    var reverseDirection = REVERSE_DIRECTION_MAP[direction] || '';

    if(this.opts.direction === reverseDirection){
      console.log('you can not move to ' + reverseDirection);
      this.opts.isAbleToMove = false;
      return this;
    }else{
      this.opts.direction = direction;
      this.opts.isAbleToMove = true;
    }

    moveToFunc(direction);

    return this;
  };
  SnakeGame.prototype.isAbleToEat = function(createFoodFunc){
    this.opts.isAbleToEat = (this.opts.head.x === this.opts.food.x) && (this.opts.head.y === this.opts.food.y);
    if(this.opts.isAbleToEat){
      // 음식생성
      createFoodFunc();
      // 점수 증가
      this.opts.totalScore += this.opts.BONE_SIZE;
      console.log('snake growth level :', this.opts.snakeBones.length + 1);
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