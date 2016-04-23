/**
 * Created by zjy on 2016/4/23.
 */
define(['paper'], function (paper) {
    var controller = {
        canvas: null,
        context: null,

        init: function (canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            this.bindEvent();
        },

        bindEvent: function () {
            var self = this;
            document.getElementById('controller').addEventListener('click', function (event) {
                var target = event.target;
                if(target.nodeName.toLowerCase() == 'div'){
                    self.setColor(target);
                }
                else if(target.id == 'reset'){
                    self.clear();
                }
            });
        },

        setColor: function (target) {
            //移除其他标签的class
            document.querySelector('.on').className = '';
            this.context.strokeStyle = target.id;
            target.className += ' on';
        },

        clear: function () {
            //清除
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //描写米字格
            paper.drawPaper();
        }
    };
    return controller;
});