/**
 * Created by zjy on 2016/4/22.
 */
require([ 'paper', 'controller', 'write' ], function (paper, controller, write) {
    //初始化获取canvas和context
  var canvas = document.getElementById('canvas');
  paper.init(canvas);
  controller.init(canvas);
  write.init(canvas);
});
