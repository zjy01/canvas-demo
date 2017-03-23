/**
 * Created by zjy on 2016/4/22.
 */
define(function () {
  var write = {
    canvas: null, //html中的canvas对象，主要标签
    context: null, //canvas对象获取的context，用于绘图
    isWriting: false, //是否正在下笔写字
    lineWidthMax: 0, //画笔最大粗细
    lineWidthMin: 0.5, //画笔最小粗细

    lastX: 0, //画笔上次停留位置
    lastY: 0,
    lastTime: 0, //上次笔时间
    lastLineWidth: 0,

    init: function (canvas) {

      this.canvas = canvas;
      this.lineWidthMax = canvas.width / 20;
      this.lastLineWidth = this.lineWidthMax / 2;

      this.context = this.canvas.getContext('2d');
            //描边处理，使笔画圆滑
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';

            //事件绑定
      this.bindEvent();
    },

    bindEvent: function () {
      var self = this;
      const canvasLT = this.canvas.getBoundingClientRect();
      //pc端
      const mouseDown$ = Rx.Observable.fromEvent(self.canvas, 'mousedown')
      .map(() => true);
      const mouseUp$ = Rx.Observable.fromEvent(self.canvas, 'mouseup')
      .map(() => false);
      const mouseOut$ = Rx.Observable.fromEvent(self.canvas, 'mouseout')
      .map(() => false);
      const mouseMove$ = Rx.Observable.fromEvent(self.canvas, 'mousemove')
      .map(e => ({ x: e.offsetX, y: e.offsetY, time: new Date() }))
      .bufferCount(2, 1);

      const mouse$ = mouseDown$.merge(mouseUp$, mouseOut$).switchMap(action => {
        return action ? mouseMove$ : Rx.Observable.empty();
      });
      mouse$.subscribe(this.writing.bind(this));


      //手机端
      const touchStart$ = Rx.Observable.fromEvent(self.canvas, 'touchstart')
      .map(() => true);
      const touchEnd$ = Rx.Observable.fromEvent(self.canvas, 'touchend')
      .map(() => false);
      const touchMove$ = Rx.Observable.fromEvent(self.canvas, 'touchmove')
      .map(e => ({ x: e.touches[0].clientX - canvasLT.left, y: e.touches[0].clientY - canvasLT.top, time: new Date() }))
      .bufferCount(2, 1);

      const touch$ = touchStart$.merge(touchEnd$).switchMap(action => {
        return action ? touchMove$ : Rx.Observable.empty();
      });
      touch$.subscribe(this.writing.bind(this));
    },

    //描绘区
    writing: function ([ start, end ]) {
      console.log(start, end);
      var curTime = new Date().getTime();
      if(curTime != this.lastTime) {
        this.context.beginPath();
        this.context.lineWidth = this.getLineWidth(this.getS(start.x, start.y, end.x, end.y), end.time - start.time);
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
        this.lastTime = curTime;
      }
    },

    getS: function (sx, sy, ex, ey) {
      return Math.sqrt((ex - sx) * (ex - sx) + (ey - sy) * (ey - sy));
    },
    getLineWidth: function (s, t) {
      var v = s / t;
      console.log(v);
      var resultLineWidth = 0;
      if(v < 1) {
        resultLineWidth = this.lineWidthMax;
      }
      else if(v > 8) {
        resultLineWidth = this.lineWidthMin;
      }
      else{ // 根据速度赋予线条宽度值
        resultLineWidth = this.lineWidthMax - (v - 0.1) / (8 - 0.1) * (this.lineWidthMax - this.lineWidthMin);
      }

            //防止变化突然，使线条平滑，借鉴上次线条粗细取值
      resultLineWidth = this.lastLineWidth * 3 / 5 + resultLineWidth * 2 / 5;

      this.lastLineWidth = resultLineWidth;
      return resultLineWidth;

    }
  };
  return write;
});
