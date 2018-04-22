var grobjects = grobjects || [];
var TexturedPlane = undefined;
var DigitBox = undefined;
var selectBox;
var dBoxes = undefined;
var answers = undefined;
var problems = undefined;
var poles = [];
var balls = [];
var posBalls = [];
var prob = [0.0,0.0,0.0];
var probState = 0;
var answer = 0;
var numDigits = 4;
var max = undefined;
var min = undefined;
var mult = undefined;
var type = undefined;
var scaleDigits = numDigits;
var scope = undefined;

if (numDigits < 4) {
 scaleDigits = 4;
}

var lastX;
var lastY;
var click = 0;

var backColor = [0.2,0.2,0.2];
var borderColor = [1.0,0.0,0.0];
var textColor = [0.0,1.0,1.0];
 var image = new Image();
 image.src = "graphicsTown/Textures/UITest.png";
 var bgImg = new Image();
 bgImg.src = "graphicsTown/Textures/BG.png";
(function() {
	"use strict";
    //creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
	//it's mostly going to be a try it once, flip if you need to.

    var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
	var shaderProgram = undefined;
	var bgBuffer = undefined;
	var dgBuffer = undefined;
	var digitBuffer = undefined;
	var canvas = undefined;
     	TexturedPlane = function (ty) {
       this.name = "TexturedPlane"
       this.position = [0,0,0];
       this.scale = [1,1];
       this.texture = null;
	   this.bgOff = [0.0,0.0];
	   this.offset = [0,0,0];
	   this.color = [1.0,1.0,1.0];
	   this.ty = ty;
    }

    TexturedPlane.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
	   canvas = drawingState.canvas;

		if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["tex-vs", "tex-fs"]);
        }
        

var bg = {
	aPosition : {numComponents: 3, data : [
         0.0,  1.0,  0.002,
         1.0,  1.0,  0.002,
         0.0,  0.0,  0.002,

         0.0,  0.0,  0.002,
         1.0,  0.0,  0.002,
         1.0,  1.0,  0.002,
	]},
	aTexCoord : {numComponents: 2, data : [
       0.0, 1.0,
       0.5, 1.0,
       0.0, 0.5,

       0.0, 0.5,
       0.5, 0.5,
       0.5, 1.0,
	]},

};
bgBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,bg);

};
    TexturedPlane.prototype.center = function () {
        return this.position;
    }

    TexturedPlane.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;
	   var modelM = twgl.m4.scaling([this.scale[0],this.scale[1],1.0]);
        twgl.m4.setTranslation(modelM,[0.0,0.0,0.0], modelM);
        gl.useProgram(shaderProgram.program);
if (this.texture == null) { 
this.texture = createGLTexture(gl, bgImg, true);
}
		var c = Math.cos(drawingState.realtime*.00005);
		var off = [this.ty*(.5*c+.5),-.5*this.ty];
        var cM = twgl.m4.lookAt([0.5,0.5,0.9],[0.5,0.5,0.0],[0,1,0]);
        var vM = twgl.m4.inverse(cM);
		twgl.setUniforms(shaderProgram,{
            view:vM, proj:drawingState.proj,
             model: modelM, uTexture : this.texture,
	 color : [1.0,1.0,1.0], offset : off });

	twgl.setBuffersAndAttributes(gl,shaderProgram,bgBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, bgBuffer);
    }

DigitBox = function (digit,type) {
		this.type = type;
        this.name = "DigitBox"+digit + "" + type;
        this.position = [0.0,0.0,0.03];
        this.scale = [0.5,0.75];
        this.texture = null;
	    this.digit = digit;
	    this.state = 0;
	    this.color = [0.2,0.2,0.5];
		this.bgOff = [0.0,0.0];
		this.bordOff = [0.0,0.0];
		this.fillOff = [0.0,0.0];
		switch (this.type) {
			case 0 : 
				if (this.digit < 5) {
					this.fillOff = [0.15*this.digit,0.0];
				} else {
					this.fillOff = [0.15*(this.digit-5),-0.25];
				}
				if (digit > 0) {
					this.position = [(.075+.085*((this.digit-1.0)%3)),
					0.45-.125*Math.floor((this.digit-1.0)/3.0),0.005];
				} else {
					this.position = [.16,0.075,.003];
				}
				break;
			case 1 : 	
				this.position = [0.35,0.35,-0.03];
				break;
			case 2 :
				this.bgOff = [0.25,-0.25];
				this.bordOff = [0.5,0.0];
				this.scale[0] = 2.0/scaleDigits;
				this.position = [.13+.15*this.scale[0]*answers.length,0.65,0.003];
				break;
			case 3 :
				if (this.digit == 0) { 
					this.color = [0.5,0.2,0.2];
				}
				else { 
					this.color = [0.2,0.5,0.2];
				}
				this.position = [0.4,.125+.275*this.digit,0.003];
				this.scale[0] = 1.0;
				this.scale[1] = 1.5;
				break;
			case 4 : 
				this.position[2] = -.003;
				this.bgOff = [.25,-.25];
				this.bordOff = [.25,0.0];
				this.scale[0] = 2.0/scaleDigits;
				break;
			case 5 : {
				this.scale = [1.0/scaleDigits,10.0,0.0];
				this.position = [.55+(.4/scaleDigits)*poles.length, 0.5,0.003];
				this.bgOff = [0.75,-0.25];
				break;
			}
			default : 
				break;
		}
	}

DigitBox.prototype.init = function (drawingState) {
	var gl = drawingState.gl;
	if (!shaderProgram) {
        shaderProgram = twgl.createProgramInfo(gl, ["tex-vs", "tex-fs"]);
        }
	var digitbox = {
		aPosition : {numComponents: 3, data : [
		//Background 0-3
		 -0.0625, 0.0625, 0.003, 	0.0625,  0.0625, 0.003,
		 -0.0625, -0.0625, 0.003, 	0.0625, -0.0625, 0.003,
		//Fill 4-7
		 -0.0625, 0.0625, 0.004, 	0.0625,  0.0625, 0.004,
		 -0.0625, -0.0625, 0.004, 	0.0625, -0.0625, 0.004,
		//Border 8-11
		 -0.075,  0.075, 0.003, 	0.075,  0.075, 0.003,
		 -0.075, -0.075, 0.003, 	0.075, -0.075, 0.003,
		]},
		aTexCoord : {numComponents : 2, data : [
			0.001,0.999,	0.249,0.999,
			0.001,0.749,	0.249,0.749,

			0.01,0.49, 	0.14,0.49,
			0.01,0.251,  0.14,0.251,

			0.001,0.749, 0.249,0.749,
			0.001,0.501,  0.249,0.501,
		]},
		indices : [
			0,1,2, 1,2,3,
			4,5,6, 5,6,7,
			8,9,10, 9,10,11
		]
	};
	digitBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,digitbox);
};


    DigitBox.prototype.center = function () {
        return this.position;
    }

    DigitBox.prototype.updateDigit = function(offset,digit) {
	this.fillOff[0] = offset[0];
	this.fillOff[1] = offset[1];
	this.digit = digit;
    }

    DigitBox.prototype.checkHitbox = function(lastXY) {
	var lY = 1.0 - lastXY[1];
	var lX = lastXY[0]; 
	    if (this.position[0] - .075*this.scale[0] < lX && 
		  this.position[0] + .075*this.scale[0] > lX) {
			if (this.position[1]-.075*this.scale[1] < lY && (this.position[1] + .075*this.scale[1] > lY)) {
				return 1;
			}
		}
		return 0;
	}

var curBox;
var selected = 0;
DigitBox.prototype.draw = function (drawingState) {
    var gl = drawingState.gl;
	var lastXY = drawingState.lastXY;
	//Update SelectBox
	if (lastXY[3] == 1) {
		for (var i = 0; i < 10; i++) {
			curBox = dBoxes[i];
			if (curBox.checkHitbox(lastXY) == 1) {
			selectBox.updateDigit(curBox.fillOff,curBox.digit);
			selectBox.position = (curBox.position);
			selected = 1;
			break;
			}
		}
		if (answers[numDigits].checkHitbox(lastXY) == 1) {
			for (var i = 0; i < numDigits; i++) {
				answers[i].updateDigit(dBoxes[0].fillOff,dBoxes[0].digit);
				poles[i].digit = 0;
				answers[i].bgOff = [.25,-.25];
				answers[i].bordOff = [.5,0.0];
			}
		}
		if (answers[answers.length-1].checkHitbox(lastXY) == 1) {
			scope.correct = evaluateProblem();
		//	scope.writeProblem();
			scope.totalCorrect += scope.correct;
			scope.probNum++;
			scope.$apply();
			if (scope.probNum == 10) {
			scope.problemSetDone();
			}
			createProblem(type);
			for (var i = 0; i < numDigits; i++) {
				answers[i].updateDigit(dBoxes[0].fillOff,dBoxes[0].digit);
				poles[i].digit = 0;
				answers[i].bgOff = [0.25,0.0];
				answers[i].bordOff = [0.25,0.0];
			}
		}
	}
//Update AnswerBoxes
	if (selected == 1 && lastXY[2] == 0) {
		for (var i = 0; i < numDigits; i++) {
		if (answers[i].checkHitbox(lastXY) == 1) {
	answers[i].updateDigit(selectBox.fillOff,selectBox.digit);
		selectBox.position = [0.0,0.0,-0.03];
		answers[i].bgOff = [0.0,0.0];
		answers[i].bordOff = [0.0,0.0];
		probState = 2;
		selected = 0;
		}
		}
	}

//Update Poles
	if (lastXY[3] == 1) {
		var cPole;
		var carry = 0;
		for (var i = 0; i < numDigits; i++) {
		cPole = poles[i];
		if (cPole.checkHitbox(lastXY) == 1) {
			var dig;
			for (var it = i*9; it < (i+1)*9; it++) {
			if ((posBalls[it]) -.05 <= (1.0-lastXY[1])) {
				dig = it-(i*9)+1;
				}
			}
				if (cPole.digit == dig) {
				cPole.digit--;
				}
				else if (dig > cPole.digit ) {
				cPole.digit = dig;
				}
				else {
				cPole.digit = dig - 1;
				}  	
			}
		}
	}


     gl.useProgram(shaderProgram.program);
	if (this.texture == null) { 
	this.texture = createGLTexture(gl, image, true);
	}
        var cM = twgl.m4.lookAt([0.5,0.5,0.9],[0.5,0.5,0.0],[0,1,0]);
        var vM = twgl.m4.inverse(cM);
	twgl.setBuffersAndAttributes(gl,shaderProgram,digitBuffer);


//Draw UI Elements
	var c = 1.0 + .2*Math.cos(drawingState.realtime*.001);
	var s = .05*Math.sin(drawingState.realtime*.001);
	var tClr = [backColor[0]*c,backColor[1]*c,backColor[2]*c];
	twgl.setUniforms(shaderProgram,{
		view:vM, proj:drawingState.proj, uTexture : this.texture,
		color : backColor,
	 });
	var modelM;
	var cBox;
	var ind;
	for (ind = 0; ind < dBoxes.length; ind++) {
		cBox = dBoxes[ind];
		if (cBox.checkHitbox(lastXY) == 1 && lastXY[2] == 0 && ind < 10)  {
			modelM = twgl.m4.scaling([cBox.scale[0],cBox.scale[1],1.0]);
			twgl.m4.rotateZ(modelM,s,modelM);
			twgl.m4.setTranslation(modelM,cBox.position,modelM);
			twgl.setUniforms(shaderProgram,{
				model: modelM, color : textColor, offset : cBox.bgOff,
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
			twgl.setUniforms(shaderProgram,{
				color : textColor, offset : cBox.fillOff,
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,12);
			twgl.setUniforms(shaderProgram,{
				 color : borderColor, offset : cBox.bordOff,
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,24);	
		} else {
		if (cBox.type == 1 && selected == 1) {
			cBox.position = [lastXY[0],1.0-lastXY[1],0.01];
		}
		modelM = twgl.m4.scaling([cBox.scale[0],cBox.scale[1],1.0]);
		twgl.m4.setTranslation(modelM,cBox.position,modelM);
		if (cBox.type != 4) {
		twgl.setUniforms(shaderProgram,{
    	    model: modelM, color : tClr, offset : cBox.bgOff,
		});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
		twgl.setUniforms(shaderProgram,{
    	    color : textColor, offset : cBox.fillOff,
		});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,12);
		twgl.setUniforms(shaderProgram,{
			 color : borderColor, offset : cBox.bordOff,
		});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,24);
	} else {
		twgl.setUniforms(shaderProgram,{
    	    model: modelM, color : textColor, offset : cBox.fillOff,
		});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,12);
		}
	}
	}


	var blockClrs = [1,0,0, 0,1,0,
		0,0,1, 1,1,1,
		1,1,0, 1,0,1,
		0,1,1, 1,1,1];
		var cPole;
		var cBalls;
		var cBall;
		var ballOff = [0.0,-0.125,0.0];
		var blockClr = [0.0,0.0,0.0];
	//Draw Abacus
	for (ind = 0; ind < numDigits; ind++) {
		cBox = poles[ind];
		modelM = twgl.m4.scaling([cBox.scale[0]/4.0,cBox.scale[1],1.0]);
		twgl.m4.setTranslation(modelM,cBox.position,modelM);
		twgl.setUniforms(shaderProgram,{
			model: modelM, offset : [0.5,0.0],
			color : [blockClrs[ind*3],blockClrs[ind*3+1],blockClrs[ind*3+2]],
		 });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
	}
	for (ind = 0; ind < numDigits; ind++) {
		blockClr = [0.0,0.0,0.0];
		cPole = poles[ind];
		for (var j = 0; j < 9; j++) {
			if (j+1 == cPole.digit) {
				ballOff = dBoxes[j+1].offset;
			}
			else {
				ballOff = [-0.5,0.5,0.0];
			}
			blockClr[0] += blockClrs[(ind*3)%24]*.1;
			blockClr[1] += blockClrs[(ind*3+1)%24]*.1;
			blockClr[2] += blockClrs[(ind*3+2)%24]*.1;
			cBall = posBalls[9*ind+j];
			if (j < cPole.digit) {
			if (cBall >= 0.1+0.07*j) {
				posBalls[9*ind+j] -= .01;
				}
			} else {
				if (cBall < 0.3+0.07*j) {
					posBalls[9*ind+j] += .01;		
				}
			}
			modelM = twgl.m4.scaling([1.0/scaleDigits,.6,1.0]);
			twgl.m4.setTranslation(modelM,[cPole.position[0],cBall,0.005],modelM);
			twgl.setUniforms(shaderProgram,{
				model: modelM, color : blockClr, offset : [0.255,0.0],
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
			if (cPole.digit == j+1) {
				twgl.setUniforms(shaderProgram,{
					color : textColor, offset : dBoxes[j+1].fillOff,
				});
			} else {
			twgl.setUniforms(shaderProgram,{
				color : [0.5,0.5,1.0], offset : [0.25,0.25],
			});
		}
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,12);
    	}
	}
}
})();

var evaluateProblem = function() {
	var ansArray = [];
	for (var i = 0; i < numDigits; i++) {
		ansArray.push(answers[i].digit);
	}
	var a = ansArray.join('');
	if (a == answer)
		 return 1;
	else 
		return 0;
}

var createProblem = function(type) {
		var maxN;
		if (!max) {
		  maxN = Math.pow(10,nD)-1;
			} else {
		  maxN = max;
			}
			if (!mult) {
				mult = 1;
			}
			var bot = min/mult;
			var top = Math.floor(max/mult);
			if (bot != Math.floor(bot)) {
			 bot = Math.floor(bot)+1;
			}
			var diff = top-bot;
			n1 = Math.round(Math.random()*diff)+1;
			n2 = Math.round(Math.random()*diff)+1;
			prob[0] = (n1+bot)*mult;
			prob[1] = (n2+bot)*mult;
			scope.num1 = prob[0];
			scope.num2 = prob[1];
			scope.$apply();
			var ans;
			var curr;
			probState = 1;
			var place = Math.pow(10,numDigits-1);
			prob[2] = type;
			switch (type) {
			case 0 : answer = prob[0] + prob[1];
				break;
			case 1 :
			if (prob[0] < prob[1]) {
				var temp = prob[0];
				prob[0] = prob[1];
				prob[1] = temp;
			} 
				answer = prob[0] - prob[1];
				break;
			case 2 : answer = prob[0] * prob[1];
				break;
			case 3 :
				prob[1] = prob[1]%10;
				var change = prob[0]%prob[1];
				prob[0]-=change;  
				answer = prob[0] / prob[1];
				break;
			}

		var cDig;
	for (var row = 0; row < 2; row++) {
		for (var i = 0; i < numDigits; i++) {
			cDig = Math.floor(prob[row]/place);
			problems[numDigits*row+i].updateDigit(dBoxes[cDig].fillOff,dBoxes[cDig].digit);
			problems[numDigits*row+i].position = [.13+.15*problems[0].scale[0]*i,0.85-.1*row,0.003];
			prob[row] = prob[row]%place;
			place = place/10;
		}
		place = Math.pow(10,numDigits-1);
	}
	var x = problems[0].position[0];
	problems[numDigits*2+1].position = [x-.15*problems[0].scale[0],.75,0.003];
	problems[numDigits*2+1].fillOff = [.75,.5-.25*type];
}

var updateColor = function(clr,swtch) {
	console.log("hello");
	clr = clr.substr(1);
    var num = parseInt(clr, 16),
    R = (num >> 16)/255.0,
    G = (num >> 8 & 0x00FF)/255.0,
	B = (num & 0x0000FF)/255.0;
	if (swtch == 0) {
	backColor = [R,G,B];
	} else if (swtch == 1) {
		borderColor = [R,G,B];
	} else {
		textColor = [R,G,B];
	}
} 

var setupPS = function(nD) {
	"use strict";
	var dom_el = document.querySelector('[ng-controller="mathCtrl"]');
	var ng_el = angular.element(dom_el);
	scope = ng_el.scope();
	var arr = nD.split(",");
	numDigits = arr[0];
	type = parseInt(arr[1]);
	max = arr[2];
	min = arr[3];
	mult = arr[4];
	if (numDigits >= 4) {
		scaleDigits = numDigits;
	} else {
		scaleDigits = 4;
	}
	grobjects = [];
	dBoxes = [];
	answers = [];
	problems = [];
	poles = [];
	grobjects = [];
	var test = new TexturedPlane(0);
	test.position[1] = 3;
	test.scale = [1.0, 1.0];
	grobjects.push(test);
	var test2 = new TexturedPlane(1);
	test2.position[1] = 3;
	test2.scale = [1.0, 1.0];
	grobjects.push(test2);
	var i;
	for (i = 0; i < 10; i++) {
		dBoxes.push(new DigitBox(i,0));
	}
	grobjects.push(dBoxes[0]);
	selectBox = new DigitBox(0,1);
	dBoxes.push(selectBox);

	for (i = 0; i < numDigits; i++) {
		answers.push(new DigitBox(0,2));
		dBoxes.push(answers[i]);
	}
	answers.push(new DigitBox(0,3));
	dBoxes.push(answers[numDigits]);
	answers.push(new DigitBox(1,3));
	dBoxes.push(answers[answers.length-1]);
	for (i = 0; i <= numDigits*2+1; i++) {
		problems.push(new DigitBox(0,4));
		dBoxes.push(problems[i]);
	}
	
	//Poles
	for (i = 0; i < numDigits; i++) {
		poles.push(new DigitBox(0,5));
	}
	posBalls = [];
	for (var i = 0; i < numDigits*10; i++) {
		posBalls.push(0.0);
	}
	createProblem(type);
}
