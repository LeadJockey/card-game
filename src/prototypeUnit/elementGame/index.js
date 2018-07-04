(function(doc, imports){
  'use strict';

  //imports
  const Render = imports.G.Render;
  const Monster = imports.G.Monster;
  const findMonster = imports.G.data.findMonster;
  //elem
  const ctx = doc.getElementById('canvas').getContext('2d');
  //instance
  const render = new Render({ctx:ctx,x:0,y:0,w:10,h:10});
  const monster = new Monster(findMonster('green-knight'));
  console.log(monster);
  //value
  const fps = 1000/60;
  let castings = [];
  let movement = function(){};
  let i = 0;

  //execute
  init();

  //init
  function init(){
    bindEvents();
    draw();
    // movement = setInterval(()=>{console.log(i);},fps);
  }

  function draw(){
    const clear = render.clearRect();
    const userHp = render.createRect(0, 0, 160, 40, 'red');
    const userStatus = render.createRect(0, 0, 130, 30, 'white');
    const userAngle = render.createTriangle(130, 0, 130, 30, 160, 0);
    const cast = render.createRect(80, 410, 200, 60, 'gray');
    const cast1 = render.createRect(85, 415, 50, 50, 'black');
    const cast2 = render.createRect(155, 415, 50, 50, 'black');
    const cast3 = render.createRect(225, 415, 50, 50, 'black');
    const skill = render.createRect(0, 520, 360, 120, 'yellow');
    const fire = render.createRect(15, 530, 100, 100, 'red');
    const water = render.createRect(130, 530, 100, 100, 'blue');
    const tree = render.createRect(245, 530, 100, 100, 'green');
    render.reset();
    render.set([
      clear,
      monster.render(render),
      userHp,
      userStatus,
      userAngle,
      cast,
      cast1,
      cast2,
      cast3,
      skill,
      fire,
      water,
      tree
    ]);
    render.draw();
  }

  function bindEvents(){
    imports.addEventListener('keydown',(e)=>{
      switch(e.key){
        case '1' :
          render.createRect(15, 530, 100, 100, 'white')();
          break;
        case '2' :
          render.createRect(130, 530, 100, 100, 'white')();
          break;
        case '3' :
          render.createRect(245, 530, 100, 100, 'white')();
          break;
        case ' ' :
          fireSkill();

          break;
        default:break;
      }

    });
    imports.addEventListener('keyup', (e) =>{
      switch(e.key){
        case '1' :
          render.createRect(15, 530, 100, 100, 'red')();
          castings.push('red');
          break;
        case '2' :
          render.createRect(130, 530, 100, 100, 'blue')();
          castings.push('blue');
          break;
        case '3' :
          render.createRect(245, 530, 100, 100, 'green')();
          castings.push('green');
          break;
        default:
          break;
      }
      console.log(castings);
      render.createRect(85, 415, 50, 50, castings[0] || 'black')();
      render.createRect(155, 415, 50, 50, castings[1] || 'black')();
      render.createRect(225, 415, 50, 50, castings[2]||'black')();
    });
  }

  function fireSkill(){
    if(castings.length < 3){return;}
    const skill = `${castings[0]}/${castings[1]}/${castings[2]}`;
    console.log(`스칼발동 : ${skill.replace('red','화').replace('blue','수').replace('green','목')}`);
    castings = [];
  }

})(document,window);
