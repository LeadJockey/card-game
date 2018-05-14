(function(){
  'use strict';
  var OPTION = {
    BONE_SIZE:20,
    SNAKE_COLOR:'#DB3079',
    FOOD_COLOR:'#97e4ff',
    canvas:document.getElementById('canvas'),
    score:document.getElementById('score'),
    ctx:document.getElementById('canvas').getContext('2d'),
    snakeLength:5,
    snakeBones:[],
    direction:'',
    isAbleToMove:false,
    totalScore:0,
    food:{
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
    this.opts = Object.assign({}, OPTION, opts || {});
  };

  SnakeGame.prototype.startGame = function(){
    var that = this;
    var C_W = that.opts.canvas.width;
    var C_H = that.opts.canvas.height;

    that.createSnake().drawSnake();


    window.addEventListener('keydown', function(evt){
      var direction = KEYCODE_DIRECTION_MAP[evt.keyCode] || '';
      var head = that.opts.snakeBones[0];
      var fps = that.opts.BONE_SIZE;

      that.opts.ctx.clearRect(0, 0, C_W, C_H);
      that.isAbleToMove(direction).headTo(direction, fps, head).drawSnake();
      // that.createFood();
      that.drawSquare(20, 100, that.opts.FOOD_COLOR);
    });

  };

  SnakeGame.prototype.createSnake = function(){
    this.opts.snakeBones = [];
    for(var i = this.opts.snakeLength; i > 0; i--){
      this.opts.snakeBones.push({
        x:i * this.opts.BONE_SIZE,
        y:0
      });
    }
    return this;
  };
  function array_diff(a, b) {
    var tmp={}, res=[];
    for(var i=0;i<a.length;i++) tmp[a[i]]=1;
    for(var i=0;i<b.length;i++) { if(tmp[b[i]]) delete tmp[b[i]]; }
    for(var k in tmp) res.push(k);
    return res;
  }
  SnakeGame.prototype.createFood = function(){
    var that = this;
    var foodXPositions = [];
    var foodYPositions = [];
    var size = this.opts.BONE_SIZE;
    var rangeW = this.opts.canvas.width - this.opts.BONE_SIZE;
    var rangeH = this.opts.canvas.height - this.opts.BONE_SIZE;

    for(var i = 1; i <= rangeW / size; i++){
      foodXPositions.push(i * size);
    }

    var test = this.opts.snakeBones.forEach(function(value){ return value.x })

    var a = array_diff(foodXPositions, test);


    console.log(a);


    this.drawSquare(20, 100, this.opts.FOOD_COLOR);
  };

  SnakeGame.prototype.drawSquare = function(x, y, color){
    this.opts.ctx.fillStyle = color;
    this.opts.ctx.fillRect(x, y, this.opts.BONE_SIZE, this.opts.BONE_SIZE);
    return this;
  };

  SnakeGame.prototype.drawSnake = function(){
    var that = this;

    that.opts.snakeBones.forEach(function(bone){
      that.drawSquare(bone.x, bone.y, that.opts.SNAKE_COLOR);
    });

    return this;
  };

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

  SnakeGame.prototype.headTo = function(direction, fps, head){
    if(!this.opts.isAbleToMove){
      return this;
    }
    var headX = head.x;
    var headY = head.y;

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

    this.opts.snakeBones.pop();
    this.opts.snakeBones.unshift({
      x:headX,
      y:headY
    });
    return this;
  };

  var game = new SnakeGame();

  game.startGame();


})();