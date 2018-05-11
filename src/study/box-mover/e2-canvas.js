(function(){
  'use strict';

  var c = document.getElementById('container');
  var ctx = c.getContext('2d');

  var W = c.width;
  var H = c.height;

  var positionX = 0;
  var positionY = 0;


  var init = function(){
    ctx.fillStyle = 'red';
    bindEvents();
    moveTo(positionX,positionY);
  };

  var bindEvents = function(){
    window.addEventListener('keydown', function(e){
      console.log(e.keyCode);
      if(e.keyCode === 39 && positionX >= 0 && positionX < 450){
        moveTo(positionX += 10, positionY);
      }
      if(e.keyCode === 37 && positionX > 0 && positionX <= 450){
        moveTo(positionX -= 10, positionY);
      }
      if(e.keyCode === 40 && positionY >= 0 && positionY < 450){
        moveTo(positionX, positionY += 10);
      }
      if(e.keyCode === 38 && positionY > 0 && positionY <= 450){
        moveTo(positionX, positionY -= 10);
      }

    });
  };

  var moveTo = function(x,y){
    ctx.clearRect(0,0,W,H);
    ctx.fillRect(x,y,50,50);
  };


  init();

})();