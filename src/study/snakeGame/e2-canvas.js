(function(){
  'use strict';

  var c = document.getElementById('container');
  var ctx = c.getContext('2d');

  var C_W = c.width;
  var C_H = c.height;
  var BOX_W = 50;
  var BOX_H = 50;

  var MIN_W = 0;
  var MAX_H = C_H - BOX_H;
  var SPEED = 50;

  var positionX = 0;
  var positionY = 0;
  var keyDownCount = 0;
  var hasTarget = false;
  var hasCrashed = false;


  var init = function(){
    bindEvents();
    move(positionX,positionY);
  };

  var bindEvents = function(){

    window.addEventListener('keydown', function(e){
      var keyCode = e.keyCode;

      toRight(keyCode === 39, move);
      toLeft(keyCode === 37, move);
      toUp(keyCode === 38, move);
      toDown(keyCode === 40, move);

      keyDownCount++;
      console.log(keyDownCount);
    });

    function toRight(hasKeyCode,drawFunc){
      if(!hasKeyCode){
        return;
      }
      var isInRange = positionX >= MIN_W && positionX < MAX_H;
      if(isInRange){
        drawFunc(positionX += SPEED, positionY);
      }
    }
    function toLeft(hasKeyCode,drawFunc){
      if(!hasKeyCode){
        return;
      }
      var isInRange = positionX > MIN_W && positionX <= MAX_H;
      if(isInRange){
        drawFunc(positionX -= SPEED, positionY);
      }
    }
    function toUp(hasKeyCode,drawFunc){
      if(!hasKeyCode){
        return;
      }
      var isInRange = positionY > MIN_W && positionY <= MAX_H;
      if(isInRange){
        drawFunc(positionX, positionY -= SPEED);
      }
    }
    function toDown(hasKeyCode,drawFunc){
      if(!hasKeyCode){
        return;
      }
      var isInRange = positionY >= MIN_W && positionY < MAX_H;
      if(isInRange){
        drawFunc(positionX, positionY += SPEED);
      }
    }
  };

  var move = function(x,y){
    ctx.clearRect(0,0,C_W,C_H);
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.rect(x,y,BOX_W,BOX_H);
    ctx.fill();

    if(keyDownCount === 3 ){
      hasTarget = true;
    }

    if(hasTarget){
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.rect(200,200,50,50);
      ctx.fill();
    }

    hasCrashed = hasTarget && positionX === 200 && positionY === 200;
    console.log(hasCrashed);

    if(hasCrashed){
      BOX_W += 50;
      hasTarget = false;
    }
  };

  init();

})();