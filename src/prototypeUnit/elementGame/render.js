(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G:{};
  exports.G.Render = exports.G.Render ? exports.G.Render:Render;

  function Render(opts){
    this.ctx = opts.ctx;
    this.x = opts.x;
    this.y = opts.y;
    this.w = opts.w;
    this.h = opts.h;
    this.rendingList = [];
  }

  Render.prototype.reset = function(){
    this.rendingList = [];
  };
  Render.prototype.set = function(list){
    const rendingList = this.rendingList;
    list.map(render => rendingList.push(render));
  };
  Render.prototype.get = function(){
    return this.rendingList;
  };
  Render.prototype.draw = function(){
    this.rendingList.map(render=>render());
  };
  Render.prototype.clearRect = function(x, y, w, h){
    return () =>{
      this.ctx.clearRect(
        x || this.x,
        y || this.y,
        w || this.ctx.canvas.width,
        h || this.ctx.canvas.height
      );
    }
  };
  Render.prototype.createRect = function(x, y, w, h, c){
    return () =>{
      this.ctx.fillStyle = c;
      this.ctx.fillRect(
        x || this.x,
        y || this.y,
        w || this.w,
        h || this.h
      );
    }
  };
  Render.prototype.createTriangle = function(x1,y1,x2,y2,x3,y3,c){
    return ()=>{
      this.ctx.fillStyle = c;
      this.ctx.beginPath();
      this.ctx.moveTo(x1,y1);
      this.ctx.lineTo(x2,y2);
      this.ctx.lineTo(x3,y3);
      this.ctx.fill();
    }
  };
  Render.prototype.createText = function(str, x, y, size, c,  align, font){
    return () =>{
      this.ctx.font = `${size || 10}px ${font || 'Comic Sans MS'}`;
      this.ctx.fillStyle = c || 'black';
      this.ctx.textAlign = align || 'center';
      this.ctx.fillText(str || '', x || this.x, y || this.y);
    }
  };
  Render.prototype.createLine = function(x1,y1,x2,y2,c){
    return ()=>{
      this.ctx.beginPath();
      this.ctx.moveTo(x1,y1);
      this.ctx.lineTo(x2,y2);
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeStyle = c;
      this.ctx.stroke();
    }
  };

})(window);