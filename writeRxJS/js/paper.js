/**
 * Created by zjy on 2016/4/22.
 */
define(function () {
  var paper = {
    canvas: null, //html中的canvas对象，主要标签
    context: null, //canvas对象获取的context，用于绘图
    init: function (canvas) {
      this.canvas = canvas;//接收外界canvas，赋值给自己的属性``canvas``，在下面的其他方法中需要用到
      this.context = canvas.getContext('2d');//通过canvas获取context，赋值给自己的属性``context``，在下面的其他方法中需要用到

            //动态设置canvas大小，兼容手机和pc
      this.canvas.width = Math.min(500, window.innerWidth - 20);// 米字格最大只能为500px
      this.canvas.height = this.canvas.width;

      this.drawPaper(); //绘制米字格背景，自己完善drawPaper方法
    },
    drawPaper: function () {
      this.drawDotted(0, 0, this.canvas.width, this.canvas.height);//左上角到右下角的斜线
      this.drawDotted(this.canvas.width, 0, 0, this.canvas.height);//左下角到右上角的斜线
      this.drawDotted(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height);//中间的横线
      this.drawDotted(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2);//中间的竖线
    },

    drawDotted: function (sx, sy, ex, ey) {
      var lineInterval = 5;//虚线的间隔
      this.context.save();//保存当前的context状态（快照，用于恢复，防止状态设置紊乱污染）

      this.context.lineWidth = 3;//线宽
      this.context.strokeStyle = '#ff1722';//线条颜色

            //setLineDash 虚线设置接口比较新，为了保险起见，自己编写一下
      if(this.context.setLineDash) { // 使用h5的setLineDash方法
        this.context.moveTo(sx, sy);
        this.context.lineTo(ex, ey);
        this.context.setLineDash([ lineInterval, lineInterval ]);//[线宽, 间隔宽]
      }
      else{ //setLineDash不存在，自己手动处理
                //len 虚线要绘制成多少段
                //
        console.log('nonononono');
        var len = Math.ceil(Math.sqrt((ex - sx) * (ex - sx) + (ey - sy) * (ey - sy)) / lineInterval / 2);
        var lineIntervalX = (ex - sx) / len;//每一段间x轴上的间隔
        var lineIntervalY = (ey - sy) / len;//每一段间y轴上的间隔
        var index = 0;//计数器
        this.context.beginPath();
        while (index < len) { //开始定制路线
          var targetX = sx + lineIntervalX;//计算当前段绘制的终点
          var targetY = sy + lineIntervalY;
          this.context.moveTo(sx, sy);//起点
          this.context.lineTo(targetX, targetY);//终点

          sx = targetX + lineIntervalX;//计算下一段绘制的起点
          sy = targetY + lineIntervalY;

          index ++;
        }
      }

      this.context.stroke();//绘制线条
      this.context.restore();//恢复保存的状态，对应 save() 方法
    }
  };
  return paper;
});
