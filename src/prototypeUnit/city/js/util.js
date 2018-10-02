'use strict';
(function(exports){
  exports.util = {};
  exports.util.selectOne = function selectOne(selector, parent){
    return parent.querySelector(selector);
  };
  exports.util.selectAll = function selectAll(selector, parent){
    return Array.prototype.slice.call(parent.querySelectorAll(selector));
  };
})(window);
