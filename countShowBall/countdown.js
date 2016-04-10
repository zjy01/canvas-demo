/**
 * Created by zjy on 2016/4/3.
 */
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var R = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

const endTime = new Date();
endTime.setHours(endTime.getHours()+1);
var curShowTimeSeconds = 0;

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function () {

    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

    R = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;


    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurrentShowTimeSeconds();

    setInterval(function () {
        render(context);
        update();
    }, 50);
};

window.onresize = function () {
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

    R = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;


    var canvas = document.getElementById('canvas');

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
};


function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret/1000);

    return ret >= 0 ? ret : 0;
}

function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600 )/60);
    var nextSeconds = parseInt( nextShowTimeSeconds % 60);


    var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600 )/60);
    var curSeconds = parseInt( curShowTimeSeconds % 60);

    if( nextSeconds != curSeconds ){
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT, MARGIN_TOP, parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(R + 1), MARGIN_TOP, parseInt(curHours%10) );
        }
        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(R + 1), MARGIN_TOP, parseInt(nextMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(R + 1), MARGIN_TOP, parseInt(curMinutes%10) );
        }
        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(R + 1), MARGIN_TOP, parseInt(curSeconds%10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(R + 1), MARGIN_TOP, parseInt(curSeconds%10) );
        }

        //时间改变交换
        curShowTimeSeconds = nextShowTimeSeconds;
    }

    //更新小球数据
    updateBalls();

    console.log(balls.length);
}

function render( context ){

    //对矩形屏幕进行刷新
    context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    var hours = parseInt( curShowTimeSeconds / 3600);
    var minutes = parseInt( (curShowTimeSeconds - hours * 3600 )/60);
    var seconds = parseInt( curShowTimeSeconds % 60);
    // 起点坐标x，y，数字，上下文

    //时
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), context);
    renderDigit(MARGIN_LEFT + 15*(R + 1), MARGIN_TOP, parseInt(hours%10), context);

    //：
    renderDigit(MARGIN_LEFT + 30*(R + 1), MARGIN_TOP, 10, context);

    //分
    renderDigit(MARGIN_LEFT + 39*(R + 1), MARGIN_TOP, parseInt(minutes/10), context);
    renderDigit(MARGIN_LEFT + 54*(R + 1), MARGIN_TOP, parseInt(minutes%10), context);

    //：
    renderDigit(MARGIN_LEFT + 69*(R + 1), MARGIN_TOP, 10, context);

    //秒
    renderDigit(MARGIN_LEFT + 78*(R + 1), MARGIN_TOP, parseInt(seconds/10), context);
    renderDigit(MARGIN_LEFT + 93*(R + 1), MARGIN_TOP, parseInt(seconds%10), context);

    //渲染小球
    for( var i = 0; i<balls.length; i++){
        context.fillStyle = balls[i].color;

        context.beginPath();
        context.arc( balls[i].x, balls[i].y, R, 0, 2*Math.PI);

        context.fill();
    }
}

function renderDigit(x, y, num, context) {
    context.fillStyle = 'rgb(0,102,153)';

    for( var i = 0; i < digit[num].length; i ++ ){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1 ) {
                context.beginPath();
                context.arc(x + j*2*(R+1) + (R+1),y + i*2*(R+1) + (R+1), R, 0, Math.PI * 2);
                context.fill();
            }
        }
    }
}

function addBalls(x, y, num){
    for( var i = 0; i < digit[num].length; i ++ ){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1 ) {
                //设置小球数据
                var aBall = {
                    x: x + j*2*(R+1) + (R+1),
                    y: y + i*2*(R+1) + (R+1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil( Math.random() * 1000 ) ) * Math.random() * 10,
                    vy: -5,
                    color: colors[Math.floor(Math.random()*colors.length)]
                };

                //加入数组中
                balls.push( aBall );
            }
        }
    }
}

function updateBalls(){

    var len = balls.length;
    for( var i = 0; i< len; i ++ ){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;


        //碰撞检测

        //底部碰撞
        if (balls[i].y >= WINDOW_HEIGHT - R ){
            balls[i].y = WINDOW_HEIGHT - R;
            balls[i].vy = -0.6*balls[i].vy;
        }

        //
        ////左边碰撞
        //if (balls[i].x <= R ){
        //    balls[i].x = R;
        //    balls[i].vx = -0.6*balls[i].vx;
        //}

        //右边碰撞
        if (balls[i].x >= WINDOW_WIDTH - R ){
            balls[i].x = WINDOW_WIDTH - R ;
            balls[i].vx = -0.6*balls[i].vx;
        }

    }


    //小球消除
    var cnt = 0;
    for( var i = 0; i< len; i ++ ){
        if(balls[i].x >= -R ){
            balls[cnt++] = balls[i];
        }
    }

    while (balls.length > cnt){
        balls.pop();
    }

}