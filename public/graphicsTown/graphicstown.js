/**
 * Created by gleicher on 10/9/2015.
 */
var arcball = undefined;
var mathCanvas = undefined;
var mathCanvasDone = 0;
var lClick = 0;

/*
this is the "main" file - it gets loaded last - after all the objects are loaded
make sure that twgl is loaded first

it sets up the main function to be called on window.onload

 */

 var isValidGraphicsObject = function (object) {
    if(object.name === undefined) {
        console.log("warning: GraphicsObject missing name field");
        return false;
    }

    if(typeof object.draw !== "function" && typeof object.drawAfter !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain either a draw or drawAfter method");
        return false;
    }

    if(typeof object.center !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain a center method. ");
        return false;
    }

    if(typeof object.init !== "function") {
        console.log("warning: GraphicsObject of type " + object.name + " does not contain an init method. ");
        return false;
    }

    return true;
 }
var setupCanvas = function(num) {
    "use strict";
	console.log("value" + num);
	console.log("setupCanvas");
    // set up the canvas and context
    mathCanvasDone = 0;
    if (!mathCanvas) {
    mathCanvas = document.createElement("canvas");
    arcball = new ArcBall(mathCanvas);
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
 //   controls.appendChild(toExamine);

    // make some sliders - using my cheesy panels code
//    var sliders = makeSliders([["TimeOfDay",0,24,12]]);

    // this could be gl = canvas.getContext("webgl");
    // but twgl is more robust
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

    // parameters for driving
    var drivePos = [0,.2,5];
    var driveTheta = 0;
    var driveXTheta = 0;

    // cheesy keyboard handling
    var keysdown = {};

    document.body.onkeydown = function(e) {
        var event = window.event ? window.event : e;
        keysdown[event.keyCode] = true;
        e.stopPropagation();
    };
    document.body.onkeyup = function(e) {
        var event = window.event ? window.event : e;
        delete keysdown[event.keyCode];
        e.stopPropagation();
    };

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
	   var lastXY = undefined;
        // implement the camera UI
        if (lClick == arcball.rC) {
            arcball.rC = 0;
        }
        lastXY = [arcball.lastX,arcball.lastY,arcball.mouseDown,arcball.rC];
        lClick = arcball.rC;
        // get lighting information
 //       var tod = Number(0);
 //       var sunAngle = Math.PI * (tod-6)/12;
 //       var sunDirection = [Math.cos(sunAngle),Math.sin(sunAngle),0];

        // make a real drawing state for drawing
        var drawingState = {
            gl : gl,
            proj : projM,   // twgl.m4.identity(),
            view : viewM,   // twgl.m4.identity(),
            camera : cameraM,
            realtime : realtime,
		 lastXY : lastXY,
        }

        // initialize all of the objects that haven't yet been initialized (that way objects can be added at any point)
        grobjects.forEach(function(obj) { 
            if(!obj.__initialized) {
                if(isValidGraphicsObject(obj)){
                    obj.init(drawingState);
                    obj.__initialized = true;
                }
            }
        });
       
            grobjects.forEach(function (obj) {
                if(obj.draw) obj.draw(drawingState);
            });

            grobjects.forEach(function (obj) {
                if(obj.drawAfter) obj.drawAfter();
            });
        var cTime = Date.now();
        var nTime = Date.now();
        while (cTime + 16 > nTime) {
            nTime = Date.now();
        }
        if (!mathCanvasDone) {
            window.requestAnimationFrame(draw);
        }
    };
    draw();
};
