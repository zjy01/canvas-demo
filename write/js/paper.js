/**
 * Created by zjy on 2016/4/22.
 */
var paper = {
    canvas: null,//html中的canvas对象，主要标签
    context: null, //canvas对象获取的context，用于绘图
    init: function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        //动态设置canvas大小，兼容手机和pc
        this.canvas.width = Math.min(500, window.innerWidth - 20);
        this.canvas.height = this.canvas.width;

        this.drawPaper(); //绘制米字格背景
    },
    drawPaper: function(){
        this.drawDotted(0, 0, this.canvas.width, this.canvas.height);
        this.drawDotted(this.canvas.width, 0, 0, this.canvas.height);
        this.drawDotted(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
        this.drawDotted(0, this.canvas.height/2, this.canvas.width, this.canvas.height/2);
    },

    drawDotted: function(sx, sy, ex, ey){
        var lineInterval = 5;//虚线的间隔
        //虚线要绘制成多少段
        var len = Math.ceil(Math.sqrt((ex - sx)*(ex - sx) + (ey - sy)*(ey - sy)) / lineInterval /2);
        var lineIntervalX = (ex - sx) / len;//每一段间x轴上的间隔
        var lineIntervalY = (ey - sy) / len;//每一段间y轴上的间隔
        var index = 0;
        this.context.save();// 保存当前状态

        this.context.lineWidth = 3;//线宽
        this.context.strokeStyle = '#ff1722';
        this.context.beginPath();
        while (index < len) {//开始定制路线
            var targetX = sx + lineIntervalX;
            var targetY = sy + lineIntervalY;
            this.context.moveTo(sx, sy);
            this.context.lineTo(targetX, targetY);

            sx = targetX + lineIntervalX;
            sy = targetY + lineIntervalY;

            index ++;
        }
        this.context.stroke();//绘制线条
        this.context.restore();//恢复到上一次保存的状态
    }
};