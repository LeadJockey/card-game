(function(exports){
  'use strict';
  const Structure = function(presetState){
    this.listeners = {};
    this.state = presetState || {};
  };
  Structure.prototype.on = function(type, callback){
    if(!this.listeners[type]){
      this.listeners[type] = callback;
    }
  };
  Structure.prototype.trigger = function(type){
    if(!this.listeners[type]){
      return;
    }
    this.listeners[type].call(this, type);
  };
  Structure.prototype.setState = function(type, newState){
    Object.assign(this.state, newState);
    this.trigger(type);
    console.log(this.state);
  };
  Structure.prototype.renderedBy = function(type){
    const that = this;
    return function(){
      const args = Array.prototype.slice.call(arguments);
      that.on(type, function(){
        args.forEach(function(fn){
          fn();
        });
      });
    }
  };

  const Pipeline = function(presetStages){
    this.stages = presetStages || [];
  };
  Pipeline.prototype.pipe = function(next){
    this.stages.push(next);
    return this;
  };
  Pipeline.prototype.process = function(data){
    let output = data || function(data){};
    this.stages.forEach(function(stage, count){
      output = stage(output);
    });
    return output;
  };

  exports.M = {};
  exports.M.Structure = Structure;
  exports.M.Pipeline = Pipeline;
})(window);