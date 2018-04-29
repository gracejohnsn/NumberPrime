/**
 * Created by gleicher on 10/9/2015.
*/
var mathCanvas = undefined;
var mathCanvasDone = 0;
var lClick = 0;
var grobjects = [];
/*
this is the "main" file - it gets loaded last - after all the objects are loaded
make sure that twgl is loaded first

it sets up the main function to be called on window.onload

 */
 var myVar,myVar3;
 var  mathScenelastXY = [0,0,0,0];
var setupCanvas = function(num) {
    "use strict";
	console.log("value" + num);
	console.log("setupCanvas");
    // set up the canvas and context
    
    mathCanvasDone = 0;
    if (!mathCanvas) {
    mathCanvas = document.createElement("canvas");
 //   arcball = new ArcBall(mathCanvas);

    mathCanvas.addEventListener("mousedown",function(e) {
    var rect = mathCanvas.getBoundingClientRect();
	  if (mathScenelastXY[3] == 0) {
        mathScenelastXY[3] = 1;
	  }
	  else {
        mathScenelastXY[3] = 0;
	  }
      mathScenelastXY[2] = 1;
        var sx = mathCanvas.width / 2;
        var sy = mathCanvas.height / 2;
        var nx = (e.pageX - sx) / sx;
        var ny = -(e.pageY - sy) / sy; 
	    mathScenelastXY[0] = (e.pageX-rect.left)/(mathCanvas.width*1.0);
       mathScenelastXY[1] = (e.pageY-rect.top)/(mathCanvas.height*1.0);
	   myVar = setTimeout(function() {}, 100);
    });
	var myVar2;
    mathCanvas.addEventListener("mousemove",function(e) {
    var rect = mathCanvas.getBoundingClientRect();
    mathScenelastXY[3] = 0;
        var sx = mathCanvas.width / 2;
        var sy = mathCanvas.height / 2;
        var nx = (e.pageX - sx) / sx;
        var ny = -(e.pageY - sy) / sy;
	    mathScenelastXY[0] = (e.pageX-rect.left)/(mathCanvas.width*1.0);
	    mathScenelastXY[1] = (e.pageY-rect.top)/(mathCanvas.height*1.0);
	  myVar2 = setTimeout(function() {}, 30);

    });


    mathCanvas.addEventListener("mouseup",function(e) {
        mathScenelastXY[3] = 0;
       mathScenelastXY[2] = 0;
        if (that.callback) that.callback();
    });
    }
    mathCanvas.onselectstart = function () { return false; }
    var h = window.screen.availHeight*.7;
    var w = window.screen.availWidth;
    mathCanvas.setAttribute("width",w);
    mathCanvas.setAttribute("height",h);
    mathCanvas.setAttribute("z-index",99);
    var bg = document.getElementById("bg");
	if (bg) {
    bg.appendChild(mathCanvas);
	}

    var gl = twgl.getWebGLContext(mathCanvas);

    // make a fake drawing state for the object initialization
    var drawingState = {
        gl : gl,
        proj : twgl.m4.identity(),
        view : twgl.m4.identity(),
        camera : twgl.m4.identity(),
        sunDirection : [0,1,0]
    }
    

    // information for the cameras
    var lookAt = [0,0,0];
    var lookFrom = [0,5,-10];
    var fov = 1.0;

    // for timing
    var realtime = 0
    var lastTime = Date.now();


    // the actual draw function - which is the main "loop"
    function draw() {
        // advance the clock appropriately (unless its stopped)
        var curTime = Date.now();
        if (mathCanvasDone) {
            return;
        }
        if (1) {
            realtime += (curTime - lastTime);
        }
        lastTime = curTime;

        // first, let's clear the screen
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
       // gl.enable(gl.BLEND);
       // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // figure out the transforms
        var projM = twgl.m4.perspective(fov, 1, 0.1, 100);
        var cameraM = twgl.m4.lookAt(lookFrom,lookAt,[0,1,0]);
        var viewM = twgl.m4.inverse(cameraM);
        if (lClick == mathScenelastXY[3]) {
            mathScenelastXY[3] = 0;
        }
        lClick =  mathScenelastXY[3];;

        var drawingState = {
            gl : gl,
            proj : projM,   // twgl.m4.identity(),
            view : viewM,   // twgl.m4.identity(),
            camera : cameraM,
            realtime : realtime,
    		 lastXY : mathScenelastXY,
        }

        // initialize all of the objects that haven't yet been initialized (that way objects can be added at any point)
        grobjects.forEach(function(obj) { 
            if(!obj.__initialized) {
                    obj.init(drawingState);
                    obj.__initialized = true;
            }
        });
       
            grobjects.forEach(function (obj) {
                if(obj.draw) obj.draw(drawingState);
            });

        if (!mathCanvasDone) {
            window.requestAnimationFrame(draw);
        }
    };
    draw();
};
