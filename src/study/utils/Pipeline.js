(function(exports){
  'use strict';

  const Pipeline = function(presetStages){
    this.stages = presetStages || [];
  };

  Pipeline.prototype.pipe = function(next){
    this.stages.push(next);
  };

  Pipeline.prototype.getStages = function(){
    return this.stages;
  };

  Pipeline.prototype.process = function(data){
    let convertedData = data || function(data){};
    this.stages.forEach(function(stage){
      convertedData = stage(convertedData);
    });
    return convertedData;
  };

  exports.M = exports.M ? exports.M : {};

  exports.M.Pipeline = Pipeline;

})(window);