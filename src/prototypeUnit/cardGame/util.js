(function(exports){
  'use strict';

  function Util(ctx){
    this.ctx = ctx;
  }
  Util.prototype.toArray = function(arr){
    return Array.prototype.slice.call(arr);
  };
  Util.prototype.select = function(selector, target){
    return (target || this.ctx).querySelector(selector);
  };
  Util.prototype.selectAll = function(selector, target){
    return this.toArray((target || this.ctx).querySelectorAll(selector));
  };
  Util.prototype.parent = function(nodeName,target){
    if((target || this.ctx).parentElement.nodeName === nodeName){
      return (target || this.ctx).parentElement;
    }else{
      return;
    }
  };

  exports.M = exports.M || {};
  exports.M.Util = exports.M.Util || Util;
})(window);