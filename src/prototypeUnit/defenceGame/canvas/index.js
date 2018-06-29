(function(exports){
  'use strict';

  exports.G = exports.G ? exports.G:{};
  exports.G.Render = exports.G.Render ? exports.G.Render:Render;

  function Render(opts){
    this.ctx = opts.ctx;
    this.scale = opts.scale;
  }

  Render.prototype.drawImage = function(opts){
    const that = this;
    return (addOpts)=>{
      const newOpts = Object.assign(opts||{},addOpts);
      return ()=>{
        const img = new Image();
        img.src = newOpts.imgSrc;
        that.ctx.drawImage(img, newOpts.x, newOpts.y);
      }

    };
  };
  Render.prototype.drawLine = function(from,to){
    const that = this;
    return ()=>{
      that.ctx.beginPath();
      that.ctx.moveTo(from.x+20,from.y+20);
      that.ctx.lineTo(to.x+20,to.y+20);
      that.ctx.strokeStyle = '#ef009d';
      that.ctx.stroke();
    }

  };
  Render.prototype.drawSquare = function(opts){
    const that = this;
    return (addOpts) =>{
      const newOpts = Object.assign(opts||{}, addOpts);
      return () =>{
        that.ctx.fillStyle = newOpts.color;
        that.ctx.fillRect(newOpts.x, newOpts.y, newOpts.w||that.scale, newOpts.h||that.scale);
      }
    }
  };
  Render.prototype.drawArc = function(opts){
    const that = this;
    return (addOpts) =>{
      const newOpts = Object.assign(opts||{}, addOpts||{});
      return () =>{
        const size = newOpts.scale / 2;
        that.ctx.beginPath();
        that.ctx.arc(newOpts.x + size, newOpts.y + size, newOpts.size, 0, 2 * Math.PI, false);
        that.ctx.fillStyle = newOpts.color;
        that.ctx.fill();
      }
    }
  };
  Render.prototype.drawAll = function(list, draw){
    list.map(item => draw(item)());
  };
  Render.prototype.clearScreen = function(){
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  };

})(window);