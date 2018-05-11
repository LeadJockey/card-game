(function(){
  'use strict';

  var container = document.getElementById('container');
  var target = document.getElementById('target');

  var positionX = 0;
  var positionY = 0;

  var moveX = function(px){
    target.style.left = px + 'px';
  };
  var moveY = function(px){
    target.style.top = px + 'px';
  };

  window.addEventListener('keydown', function(e){
    console.log(e.keyCode);
    console.log('e.keyCode === 39', e.keyCode === 39);
    if(e.keyCode === 39 && positionX >= 0){
      moveX(positionX += 10);
    }
    if(e.keyCode === 37 && positionX > 0){
      moveX(positionX -= 10);
    }
    if(e.keyCode === 40 && positionY >= 0){
      moveY(positionY += 10);
    }
    if(e.keyCode === 38 && positionY > 0){
      moveY(positionY -= 10);
    }

  });

})();