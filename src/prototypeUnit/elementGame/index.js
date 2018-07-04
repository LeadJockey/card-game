(function(doc, imports){
  'use strict';

  //imports
  const Render = imports.G.Render;
  const Monster = imports.G.Monster;
  const User = imports.G.User;
  const findMonster = imports.G.data.findMonster;
  //elem
  const ctx = doc.getElementById('canvas').getContext('2d');
  //instance
  const render = new Render({ctx:ctx,x:0,y:0,w:10,h:10});
  const monster = new Monster(findMonster('beast-green'));
  const user = new User({ name:'shawn', maxHp:100, exp:0 });
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
  }

  function draw(){
    const clear = render.clearRect();
    const cast = render.createRect(80, 410, 200, 60, 'gray');
    const cast1 = render.createRect(85, 415, 50, 50, castings[0] ||'black');
    const cast2 = render.createRect(155, 415, 50, 50, castings[1] ||'black');
    const cast3 = render.createRect(225, 415, 50, 50, castings[2] ||'black');
    const skill = render.createRect(0, 520, 360, 120, 'yellow');
    const fire = render.createRect(15, 530, 100, 100, 'red');
    const water = render.createRect(130, 530, 100, 100, 'blue');
    const tree = render.createRect(245, 530, 100, 100, 'green');

    render.reset();
    render.set([
      clear, //clear
      monster.render(render), //monster
      user.render(render), //user
      cast, cast1, cast2, cast3, //casting
      skill, fire, water, tree // skills
    ]);
    render.draw();
  }

  function bindEvents(){
    imports.addEventListener('keydown',(e)=>{
      switch(e.key){
        case '1' :render.createRect(15, 530, 100, 100, 'white')();break;
        case '2' :render.createRect(130, 530, 100, 100, 'white')();break;
        case '3' :render.createRect(245, 530, 100, 100, 'white')();break;
        case ' ' :fireSkill();break;
        default:break;
      }

    });
    imports.addEventListener('keyup', (e) =>{
      switch(e.key){
        case '1' :render.createRect(15, 530, 100, 100, 'red')();castings.push('red');break;
        case '2' :render.createRect(130, 530, 100, 100, 'blue')();castings.push('blue');break;
        case '3' :render.createRect(245, 530, 100, 100, 'green')();castings.push('green');break;
        default:break;
      }
      draw();
    });
  }

  function fireSkill(){
    if(castings.length < 3){return;}
    const skill = `${castings[0]}/${castings[1]}/${castings[2]}`;
    console.log(`스칼발동 : ${skill.replace(/[red]+/g,'화').replace(/[blue]+/g,'수').replace(/[green]+/g,'목')}`);
    monster.damaged(10);
    castings = [];
  }

})(document,window);
