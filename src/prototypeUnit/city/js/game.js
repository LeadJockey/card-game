'use strict';
window.onload = function(){
  (function(exports, doc){

    var OBJECT_SIZE = 100;
    //comm func
    var jsRender = exports.jsrender;
    var selectOne = exports.util.selectOne;
    var selectAll = exports.util.selectAll;

    //elem
    var ctx = selectOne('.game', doc);
    var elMap = selectOne('.map', ctx);
    //tmpl
    var tmplFiled = selectOne('.filed', doc);
    //value
    var gold = 1000;



    init();

    function init(){
      renderFiled();
      bindEvent();
    }

    function bindEvent(){
      var elBoxFiledList = selectAll('.box_filed', ctx);
      elBoxFiledList.forEach(function(boxFiled, idx){
        boxFiled.addEventListener('click', function(){
          if(gold < 1000){
            return;
          }
          gold-= 1000;
          console.log('gold : ',gold);
          exports.dataList[idx].name = '오두막';
          exports.dataList[idx].level = 2;
          exports.dataList[idx].class = 'box_filed box_house';
          boxFiled.innerHTML = jsRender.templates(tmplFiled.innerHTML).render(exports.dataList[idx]);
        });
      });
    }

    function renderFiled(){
      elMap.innerHTML = jsRender.templates(tmplFiled.innerHTML).render(exports.dataList);
    }

  })(window, document);
};
