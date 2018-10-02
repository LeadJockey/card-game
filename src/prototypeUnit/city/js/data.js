'use strict';
(function(exports){
  function setFiledData(count){
    var filedList = [];
    var id = 0;
    for(id; id < count; id++){
      filedList.push({
        id:id,
        name:'',
        class:'box_filed',
        level:0
      });
    }
    return filedList;
  }

  exports.dataList = setFiledData(60);
  console.log(exports.dataList);
})(window);
