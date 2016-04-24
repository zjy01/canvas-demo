/**
 * Created by zjy on 2016/4/22.
 */
define(function () {
    var write = {
        canvas: null, //html中的canvas对象，主要标签
        context: null, //canvas对象获取的context，用于绘图
        isWriting: false,//是否正在下笔写字
        lineWidthMax: 0, //画笔最大粗细
        lineWidthMin: 1, //画笔最小粗细

        lastX: 0,//画笔上次停留位置
        lastY: 0,
        lastTime: 0, //上次笔时间
        lastLineWidth: 0,

        init: function (canvas) {

            this.canvas = canvas;
            this.lineWidthMax = canvas.width/20;
            this.lastLineWidth = this.lineWidthMax /2;

            this.context = this.canvas.getContext('2d');
            //描边处理，使笔画圆滑
            this.context.lineCap = 'round';
            this.context.lineJoin = 'round';

            //事件绑定
            this.bindEvent();
        },

        bindEvent: function () {
            var self = this;
            //pc端
            //下笔
            self.canvas.onmousedown = function (e) {
                e.preventDefault();
                self.startWrite(self.getCo(e.clientX, e.clientY))
            };

            //移动
            self.canvas.onmousemove = function (e) {
                e.preventDefault();
                if(self.isWriting){
                    self.writing(self.getCo(e.clientX, e.clientY));
                }
            };

            //收笔
            self.canvas.onmouseup = function (e) {
                e.preventDefault();
                self.endWrite();
            };

            //出界
            self.canvas.onmouseout = function (e) {
                e.preventDefault();
                if(self.isWriting) {
                    self.endWrite();
                }
            };

            //下笔
            self.canvas.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var touch = e.touches[0];
                self.startWrite(self.getCo(touch.clientX, touch.clientY))
            });

            //移动
            self.canvas.addEventListener('touchmove', function (e) {
                e.preventDefault();
                if(self.isWriting){
                    var touch = e.touches[0];
                    self.writing(self.getCo(touch.clientX, touch.clientY));
                }
            });

            //收笔
            self.canvas.addEventListener('touchend', function (e) {
                e.preventDefault();
                self.endWrite();
            })
        },

        //描绘区
        startWrite: function (co) {
            this.isWriting = true;
            this.lastX = co.x;
            this.lastY = co.y;
            this.lastTime = new Date().getTime();
            this.lastLineWidth = this.lineWidthMax /2;
        },
        writing: function (co) {
            var curTime = new Date().getTime();
            if(curTime != this.lastTime){
                this.context.beginPath();
                this.context.lineWidth = this.getLineWidth(this.getS(this.lastX, this.lastY, co.x, co.y), curTime - this.lastTime);
                this.context.moveTo(this.lastX, this.lastY);
                this.context.lineTo(co.x, co.y);
                this.context.stroke();

                this.lastX = co.x;
                this.lastY = co.y;
                this.lastTime = curTime;
            }
        },

        endWrite: function(){
            this.isWriting = false;
        },

        //辅助函数区
        getCo: function (clientX, clientY) {
            var canvasLT = this.canvas.getBoundingClientRect();
            return {x: clientX - canvasLT.left, y: clientY - canvasLT.top};
        },
        getS: function (sx, sy, ex, ey) {
            return Math.sqrt((ex - sx)*(ex - sx) + (ey - sy)*(ey - sy))
        },
        getLineWidth: function (s, t) {
            var v = s/t;
            var resultLineWidth = 0;
            if(v < 0.1){
                resultLineWidth = this.lineWidthMax;
            }
            else if(v >8){
                resultLineWidth = this.lineWidthMin;
            }
            else{ // 根据速度赋予线条宽度值
                resultLineWidth = this.lineWidthMax - (v-0.1)/(8-0.1)*(this.lineWidthMax - this.lineWidthMin)
            }

            //防止变化突然，使线条平滑，借鉴上次线条粗细取值
            resultLineWidth = this.lastLineWidth * 3/5 + resultLineWidth * 2/5;

            this.lastLineWidth = resultLineWidth;
            return resultLineWidth;

        }
    };
    return write;
});