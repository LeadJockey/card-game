(function(doc, imports){
  'use strict';

  // imports
  const Render = imports.Render;
  const Tower = imports.Tower;
  const Monster = imports.Monster;
  const Spot = imports.Spot;
  const Missile = imports.Missile;

  // elem
  const canvas = doc.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // value
  const objectScale = 50;
  const sec = 1000;
  const gameFps = sec / 60;
  const waveFps = gameFps*100;
  const towers = [
    new Tower({
      x:200,
      y:200,
      dmg:10,
      color:'rgba(10, 100, 200, 0.5)',
      imgSrc:'images/tower14.png',
      scale:objectScale,
      speed: 2
    }),
    new Tower({
      x:400,
      y:450,
      dmg:10,
      color:'rgba(10, 100, 200, 0.5)',
      imgSrc:'images/tower14.png',
      scale:objectScale,
      speed: 2
    }),
    new Tower({
      x:100,
      y:350,
      dmg:10,
      color:'rgba(10, 100, 200, 0.5)',
      imgSrc:'images/tower14.png',
      scale:objectScale,
      speed: 2
    }),
    new Tower({
      x:350,
      y:50,
      dmg:10,
      color:'rgba(10, 100, 200, 0.5)',
      imgSrc:'images/tower14.png',
      scale:objectScale,
      speed: 2
    }),
    new Tower({
      x:250,
      y:250,
      dmg:10,
      color:'rgba(10, 100, 200, 0.5)',
      imgSrc:'images/tower14.png',
      scale:objectScale,
      speed: 2
    }),
    new Tower({
      x:150,
      y:150,
      dmg:10,
      color:'rgba(10, 100, 200, 0.5)',
      imgSrc:'images/tower14.png',
      scale:objectScale,
      speed: 2
    }),
    new Tower({
      x:100,
      y:250,
      dmg:10,
      color:'rgba(10, 100, 200, 0.5)',
      imgSrc:'images/tower14.png',
      scale:objectScale,
      speed: 2
    }),
  ];
  const paths = [
    {
      x:50,
      y:0
    },
    {
      x:50,
      y:50
    },
    {
      x:50,
      y:100
    },
    {
      x:100,
      y:100
    },
    {
      x:150,
      y:100
    },
    {
      x:200,
      y:100
    },
    {
      x:250,
      y:100
    },
    {
      x:300,
      y:100
    },
    {
      x:300,
      y:100
    },
    {
      x:300,
      y:150
    },
    {
      x:300,
      y:200
    },
    {
      x:300,
      y:250
    },
    {
      x:300,
      y:300
    },
    {
      x:250,
      y:300
    },
    {
      x:200,
      y:300
    },
    {
      x:150,
      y:300
    },
    {
      x:100,
      y:300
    },
    {
      x:50,
      y:300
    },
    {
      x:0,
      y:300
    },
    {
      x:0,
      y:350
    },
    {
      x:0,
      y:400
    },
    {
      x:0,
      y:450
    },
    {
      x:50,
      y:450
    },
    {
      x:100,
      y:450
    },
    {
      x:150,
      y:450
    },
    {
      x:200,
      y:450
    },
    {
      x:200,
      y:400
    },
    {
      x:250,
      y:400
    },
    {
      x:300,
      y:400
    },
    {
      x:350,
      y:400
    },
    {
      x:400,
      y:400
    },
    {
      x:400,
      y:350
    },
    {
      x:400,
      y:300
    },
    {
      x:400,
      y:250
    },
    {
      x:400,
      y:200
    },
    {
      x:400,
      y:150
    },
    {
      x:400,
      y:100
    },
    {
      x:400,
      y:50
    },
    {
      x:400,
      y:0
    },
    {
      x:350,
      y:0
    },
    {
      x:300,
      y:0
    },
    {
      x:250,
      y:0
    },
    {
      x:200,
      y:0
    },
    {
      x:150,
      y:0
    },
    {
      x:100,
      y:0
    },
  ]; // 길 그리기 좌표
  const spots = [
    new Spot({ x:50, y:0, color:'rgba(255, 155, 5, 0.2)', direction:'bottom' }),
    new Spot({
      x:50,
      y:100,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'right'
    }),
    new Spot({
      x:300,
      y:100,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'bottom'
    }),
    new Spot({
      x:300,
      y:300,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'left'
    }),
    new Spot({
      x:0,
      y:300,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'bottom'
    }),
    new Spot({
      x:0,
      y:450,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'right'
    }),
    new Spot({
      x:200,
      y:450,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'top'
    }),
    new Spot({
      x:200,
      y:400,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'right'
    }),
    new Spot({
      x:400,
      y:400,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'top'
    }),
    new Spot({
      x:400,
      y:0,
      color:'rgba(255, 155, 5, 0.2)',
      direction:'left'
    }),
  ];
  const missiles = [];
  const wave = [];
  let game = function(){};
  let wave1 = function(){};
  let time = 0;

  //instance
  const render = new Render({
    ctx:ctx,
    scale:objectScale
  });


  // init
  init();


  function init(){
    doc.getElementById('btn').addEventListener('click',()=>{
      game = setInterval(gameLoop, gameFps);
      wave1 = setInterval(monsterFactory(10), waveFps);
    });
  }

  function gameLoop(){
    time++;
    render.clearScreen();
    // render.drawImage()({imgSrc:'images/background3.png',x:0,y:0})();
    // render.drawAll(paths, render.drawSquare({ color:'yellow' }));
    towers.map(tower => tower.print(/*render.drawSquare(tower),*/render.drawImage(tower)));
    spots.map(spot => spot.print(render.drawSquare(spot)));
    wave.filter(monster => monster.isLive())
        .map((monster) =>{
          spots.map(spot => spot.track(monster));
          monster.moveTo(monster.direction).print(render.drawArc());
          towers.map(tower => tower.fire(render.drawLine(tower,monster),missiles, wave, Missile));
        });
    missiles.filter(missile => missile.isMove).map(missile => {
      missile.move(wave, missiles);
      missile.print(render.drawSquare({ w:5, h:5 }));
    });
  }

  function monsterFactory(length){
    return () =>{
      if(wave.length < length){
        wave.push(new Monster({
          x:50,
          y:0,
          color:'red',
          size:20,
          speed:1,
          direction:'bottom',
          minFrame:0,
          maxFrame:canvas.width - objectScale,
          scale:objectScale
        }));
      }
    }
  }
})(document, window.G);