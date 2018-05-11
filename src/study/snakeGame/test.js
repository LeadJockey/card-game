(function(){
  'use strict';
  var OPTION = {
    canvas:document.getElementById('canvas'),
    score:document.getElementById('score'),
    ctx :document.getElementById('canvas').getContext('2d'),
    BONE_SIZE : 20,
    SNAKE_COLOR : '#DB3079',
    snakeLength : 5,
    snakeBones : []
  };

  var SnakeGame = function(opts){
    this.opts = Object.assign({}, OPTION, opts);
    this.init();
  };

  SnakeGame.prototype.init = function(){
    var that = this;

    that.createSnake().drawSnake();
    window.addEventListener('keydown',function(evt){
      console.log(evt.keyCode);
      that.moveSnake(evt.keyCode);
    });
  };

  SnakeGame.prototype.drawSquare = function(x,y,color){
    this.opts.ctx.fillStyle = color;
    this.opts.ctx.fillRect(x, y, this.opts.BONE_SIZE, this.opts.BONE_SIZE);
    return this;
  };

  SnakeGame.prototype.drawSnake = function(){
    var that = this;
    that.opts.snakeBones.forEach(function(bone){
      that.drawSquare(bone.x,bone.y,that.opts.SNAKE_COLOR);
    });
    return this;
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
  
  
  
  SnakeGame.prototype.moveSnake = function(keyCode){
    var snakeHead = this.opts.snakeBones[0];
    var headX = snakeHead.x;
    var headY = snakeHead.y;
    var DIRECTION_MAP = {
      right:headX += this.opts.BONE_SIZE,
      left:headX -= this.opts.BONE_SIZE,
      up  :headY -= this.opts.BONE_SIZE,
      down:headY += this.opts.BONE_SIZE
    };

    // var tail = this.opts.snakeBones.pop();
    // tail.x = headX;
    // tail.y = headY;
    // this.opts.snakeBones.unshift(tail);
    this.createSnake().drawSnake();
    
  };


  var game = new SnakeGame({
    SNAKE_COLOR:'skyblue'
  });








})();