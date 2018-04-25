var grobjects = grobjects || [];
var TexturedPlane = undefined;
var DigitBox = undefined;

var mathScene = {
	//The Scope For the Scene
	scope : undefined,
	//Input 
	lastXY : undefined,
	//Draggable/Clickable Buttons
	buttons : undefined,
	//Problem Space
	problems : undefined,
	//Students Answer Space
	answers : undefined,
	abacus : {
		poles : undefined,
		ballPos : undefined,
		colors : undefined,
	},
	//Selected Box
	selected : undefined,
	//Parameters for Problem
	params : undefined,
	//Tracking Current Problem and Overall Problem Set
	currProb : undefined,
	problemSet : undefined,
	colors : undefined,
}

var prob = [0.0,0.0,0.0];
var probState = 0;
var answer = 0;
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
	]}
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
			 color : [1.0,1.0,1.0], offset : off 
		});
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
				if (mathScene.buttons.length >= 10) {
					if (this.digit == 0) { 
						this.color = [0.5,0.2,0.2];
					}
					else { 
						this.color = [0.2,0.5,0.2];
					}
					this.position = [0.4,.215+.215*this.digit,0.003];
					this.scale[0] = 0.75;
					this.scale[1] = 1.0;
				} else {
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
				}
				break;
			case 1 : 	
				this.position = [0.35,0.35,-0.03];
				break;
			case 2 :
				this.bgOff = [0.25,-0.25];
				this.bordOff = [0.5,0.0];
				this.scale[0] = 2.0/mathScene.params[8];
				this.position = [.13+.15*this.scale[0]*mathScene.answers.length,0.65,0.003];
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
				this.scale[0] = 2.0/mathScene.params[8];
				break;
			case 5 : {
				this.scale = [1.0/mathScene.params[8],10.0,0.0];
				this.position = [.55+(.4/mathScene.params[8])*mathScene.abacus.poles.length, 0.5,0.003];
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

    DigitBox.prototype.checkHitbox = function() {
	var lY = 1.0 - mathScene.lastXY[1];
	var lX = mathScene.lastXY[0]; 
	    if (this.position[0] - .075*this.scale[0] < lX && 
		  this.position[0] + .075*this.scale[0] > lX) {
			if (this.position[1]-.075*this.scale[1] < lY && (this.position[1] + .075*this.scale[1] > lY)) {
				return 1;
			}
		}
		return 0;
	}

	var selected = 0;
	var checkInput = function() {
		var curBox;
		if (selected == 0 && mathScene.selected.position != mathScene.buttons[mathScene.selected.digit].position) {
			var cPos = mathScene.selected.position;
			var nPos = mathScene.buttons[mathScene.selected.digit].position;
			var dPos = [nPos[0]-cPos[0],nPos[1]-cPos[1],cPos[2]-nPos[2]];
			var theta = Math.atan2(dPos[1], dPos[0]);
			var dst = Math.sqrt(dPos[0]*dPos[0] + dPos[1]*dPos[1]);
			mathScene.selected.position[0] += .01*(dPos[0]/dst);
			mathScene.selected.position[1] += .01*(dPos[1]/dst);
//			console.log(dPos);
			if (dst < 0.01 && dst > -0.01) {
				mathScene.selected.position = nPos;
			}
			//mathScene.selected.position[0] += theta*0.001;
			//mathScene.selected.position[1] += theta*0.001;
		}
		if (mathScene.lastXY[3] == 1 && mathScene.lastXY[0] < 0.5 
			&& mathScene.lastXY[1] > 0.5) {
			for (var i = 0; i < 10; i++) {
				curBox = mathScene.buttons[i];
				if (curBox.checkHitbox() == 1) {
				mathScene.selected.updateDigit(curBox.fillOff,curBox.digit);
				mathScene.selected.position = (curBox.position);
				selected = 1;
				break;
				}
			}
			if (mathScene.buttons[mathScene.buttons.length-2].checkHitbox() == 1) {
				for (var i = 0; i < mathScene.params[0]; i++) {
					mathScene.answers[i].updateDigit(mathScene.buttons[0].fillOff,mathScene.buttons[0].digit);
					mathScene.abacus.poles[i].digit = 0;
					mathScene.answers[i].bgOff = [.25,-.25];
					mathScene.answers[i].bordOff = [.5,0.0];
				}
			}
			if (mathScene.buttons[mathScene.buttons.length-1].checkHitbox() == 1) {
				mathScene.scope.correct = evaluateProblem();
			//	mathScene.scope.writeProblem();
				mathScene.scope.totalCorrect += mathScene.scope.correct;
				mathScene.scope.probNum++;
				mathScene.scope.$apply();
				if (mathScene.scope.probNum == 10) {
					mathScene.scope.writeProblem();
					mathScene.scope.problemSetDone();
				}
				createProblem();
				for (var i = 0; i < mathScene.params[0]; i++) {
					mathScene.answers[i].updateDigit(mathScene.buttons[0].fillOff,mathScene.buttons[0].digit);
					mathScene.abacus.poles[i].digit = 0;
					mathScene.answers[i].bgOff = [.25,-.25];
					mathScene.answers[i].bordOff = [.5,0.0];
				}
			}
		}
	//Update AnswerBoxes
		if (selected == 1 && mathScene.lastXY[2] == 0) {
			for (var i = 0; i < mathScene.params[0]; i++) {
			if (mathScene.answers[i].checkHitbox() == 1) {
				mathScene.answers[i].updateDigit(mathScene.selected.fillOff,mathScene.selected.digit);
				mathScene.selected.position = [0.0,0.0,-0.03];
				mathScene.answers[i].bgOff = [0.0,0.0];
				mathScene.answers[i].bordOff = [0.0,0.0];
				probState = 2;
				selected = 0;
			}
			}
		}
		if (selected == 1 && mathScene.lastXY[2] == 0) {
			selected = 0;
		}
	//Update Poles
		if (mathScene.lastXY[3] == 1 && mathScene.lastXY[0] > 0.5) {
			var cPole;
			var carry = 0;
			for (var i = 0; i < mathScene.params[0]; i++) {
			cPole = mathScene.abacus.poles[i];
			if (cPole.checkHitbox() == 1) {
				var dig;
				for (var it = i*9; it < (i+1)*9; it++) {
				if ((mathScene.abacus.ballPos[it]) -.05 <= (1.0-mathScene.lastXY[1])) {
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
	}


	var drawAbacus = function(gl) {
		var cBox;
		var modelM;
		var blockClrs = [1,0,0, 0,1,0,
			0,0,1, 1,1,1,
			1,1,0, 1,0,1,
			0,1,1, 1,1,1];
			var cBall;
			var blockClr = [0.0,0.0,0.0];
		for (var ind = 0; ind < mathScene.params[0]; ind++) {
			cBox = mathScene.abacus.poles[ind];
			modelM = twgl.m4.scaling([cBox.scale[0]/4.0,cBox.scale[1],1.0]);
			twgl.m4.setTranslation(modelM,cBox.position,modelM);
			twgl.setUniforms(shaderProgram,{
				model: modelM, offset : [0.5,0.0],
				color : [blockClrs[ind*3],blockClrs[ind*3+1],blockClrs[ind*3+2]],
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
			blockClr = [0.0,0.0,0.0];
			for (var j = 0; j < 9; j++) {
				blockClr[0] += blockClrs[(ind*3)%24]*.1;
				blockClr[1] += blockClrs[(ind*3+1)%24]*.1;
				blockClr[2] += blockClrs[(ind*3+2)%24]*.1;
				cBall = mathScene.abacus.ballPos[9*ind+j];
				if (j < cBox.digit) {
				if (cBall >= 0.1+0.07*j) {
					mathScene.abacus.ballPos[9*ind+j] -= .01;
					}
				} else {
					if (cBall < 0.3+0.07*j) {
						mathScene.abacus.ballPos[9*ind+j] += .01;		
					}
				}
				modelM = twgl.m4.scaling([1.0/mathScene.params[8],.6,1.0]);
				twgl.m4.setTranslation(modelM,[cBox.position[0],cBall,0.005],modelM);
				twgl.setUniforms(shaderProgram,{
					model: modelM, color : blockClr, offset : [0.255,0.0],
				});
				twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
				if (cBox.digit == j+1) {
					twgl.setUniforms(shaderProgram,{
						color : textColor, offset : mathScene.buttons[j+1].fillOff,
					});
					twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,12);
				} 
			}
		}
	}

	
	DigitBox.prototype.draw = function (drawingState) {
    	var gl = drawingState.gl;
		mathScene.lastXY = drawingState.lastXY;
		//Get Input and Update
		checkInput();
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
		});
		var modelM;
		var cBox;
		var ind;
		//Draw Buttons and Selected Box
		for (ind = 0; ind < mathScene.buttons.length+1; ind++) {
			if (ind < mathScene.buttons.length) {
				cBox = mathScene.buttons[ind];
			} else {
				cBox = mathScene.selected;
				if (selected)
					cBox.position = [mathScene.lastXY[0],1.0-mathScene.lastXY[1],0.01];
			}
			modelM = twgl.m4.scaling([cBox.scale[0],cBox.scale[1],1.0]);
			var check = cBox.checkHitbox();
			if (check == 1 && selected == 0) {
				twgl.m4.rotateZ(modelM,s,modelM);
				twgl.m4.setTranslation(modelM,cBox.position,modelM);
				twgl.setUniforms(shaderProgram,{
					model: modelM, color : textColor, offset : cBox.bgOff,
				});
			} else {
				twgl.m4.setTranslation(modelM,cBox.position,modelM);
				twgl.setUniforms(shaderProgram,{
					model: modelM, color : tClr, offset : cBox.bgOff,
				});
			}
			if (ind >= 10 && ind < mathScene.buttons.length) {
				if (cBox.digit == 0) {
					twgl.setUniforms(shaderProgram,{
					 color : [0.8,0.2,0.2],
					});
				} else {
					twgl.setUniforms(shaderProgram,{
						color : [0.2,0.8,0.2],
					   });
				}
				twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
				twgl.setUniforms(shaderProgram,{
					color : [.5,.5,.5], offset : cBox.bordOff,
				});
				twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,24);
			} else {
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6);
			twgl.setUniforms(shaderProgram,{
				color : textColor, offset : cBox.fillOff,
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,12);
			twgl.setUniforms(shaderProgram,{
				color : borderColor, offset : cBox.bordOff,
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,24);
			}
		}
		//Draw Problem and Answer
		for (ind = 0; ind < mathScene.problems.length;ind++) {
			cBox = mathScene.problems[ind];
			modelM = twgl.m4.scaling([cBox.scale[0],cBox.scale[1],1.0]);
			twgl.m4.setTranslation(modelM,cBox.position,modelM);
			twgl.setUniforms(shaderProgram,{
				model: modelM, color : textColor, offset : cBox.fillOff,
			});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer,6,12);
		}
		for (ind = 0; ind < mathScene.answers.length;ind++) {
			cBox = mathScene.answers[ind];
			modelM = twgl.m4.scaling([cBox.scale[0],cBox.scale[1],1.0]);
			twgl.m4.setTranslation(modelM,cBox.position,modelM);
			twgl.setUniforms(shaderProgram,{
				model: modelM, color : backColor, offset : cBox.bgOff,
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
		}
		drawAbacus(gl);
	}
})();

	var evaluateProblem = function() {
		var ansArray = [];	
		for (var i = 0; i < mathScene.params[0]; i++) {
			ansArray.push(mathScene.answers[i].digit);
		}
		var a = ansArray.join('');
		if (a == answer)
			 return 1;
		else 
			return 0;
	}

	var createProblem = function() {
		var type = mathScene.params[1];
		var max = mathScene.params[2];
		var min = mathScene.params[3];
		var mult = mathScene.params[4];
		var max2 = mathScene.params[5];
		var min2 = mathScene.params[6];
		var mult2 = mathScene.params[7];
		var bot = min/mult;
		var top = Math.floor(max/mult);
		if (bot != Math.floor(bot)) {
			 bot = Math.floor(bot)+1;
		}
		var diff = top-bot+1;
		n1 = Math.floor(Math.random()*diff)+bot;
		bot = min2/mult2;
		top = Math.floor(max2/mult2);
		if (bot != Math.floor(bot)) {
			 bot = Math.floor(bot)+1;
		}
		diff = top-bot+1;
		n2 = Math.floor(Math.random()*diff)+bot;
		prob[0] = (n1)*mult;
		prob[1] = (n2)*mult2;
		mathScene.scope.num1 = prob[0];
		mathScene.scope.num2 = prob[1];
		mathScene.scope.$apply();
		var ans;
		var curr;
		probState = 1;
		var place = Math.pow(10,mathScene.params[0]-1);
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
				var r = prob[0]/prob[1];
				r = Math.floor(r)+1;
				prob[0] = r*prob[1];  
				answer = r;
				break;
			}

		var cDig;
		for (var row = 0; row < 2; row++) {
			for (var i = 0; i < mathScene.params[0]; i++) {
					cDig = Math.floor(prob[row]/place);
					mathScene.problems[mathScene.params[0]*row+i].updateDigit(
					mathScene.buttons[cDig].fillOff,mathScene.buttons[cDig].digit);
					mathScene.problems[mathScene.params[0]*row+i].position = [.13+.15*mathScene.problems[0].scale[0]*i,0.85-.1*row,0.003];
					prob[row] = prob[row]%place;
					place = place/10;
				}
			place = Math.pow(10,mathScene.params[0]-1);
		}
		var x = mathScene.problems[0].position[0];
		mathScene.problems[mathScene.params[0]*2+1].position = [x-.15*mathScene.problems[0].scale[0],.75,0.003];
		mathScene.problems[mathScene.params[0]*2+1].fillOff = [.75,.5-.25*type];
	}

	var updateColor = function(clr,swtch) {
		clr = clr.substr(1);
	    var num = parseInt(clr, 16),
		R = (num >> 16)/255.0;
		if (R < .1)
			R = .1;
		G = (num >> 8 & 0x00FF)/255.0;
		if (G < .1) 
			G = .1;
		B = (num & 0x0000FF)/255.0;
		if (B < .1)
			B = .1;
		if (swtch == 0) {
		backColor = [R,G,B];
		} else if (swtch == 1) {
			borderColor = [R,G,B];
		} else {
			textColor = [R,G,B];
		}
	} 

var setupPS = function(parameters) {
	"use strict";
	var dom_el = document.querySelector('[ng-controller="mathCtrl"]');
	var ng_el = angular.element(dom_el);
	mathScene.scope = ng_el.scope();
	console.log(parameters);
	mathScene.params = parameters.split(",");

	for (var i = 0; i < mathScene.params.length; i++) {
		mathScene.params[i] = parseInt(mathScene.params[i]);
		if (mathScene.params[i] == null || mathScene.params[i] == "") {
			mathScene.params[i] = 0;
		} else if (mathScene.params[i] < 0) {
			mathScene.params[i] = mathScene.params[i]*-1;
		}
	}
	console.log(mathScene.params);
	var highestVal;
	var p = 0;
	if (mathScene.params[1] == 2) {
		highestVal = mathScene.params[2]*mathScene.params[5];
	} else if (mathScene.params[1] == 0){
		highestVal = mathScene.params[2]+mathScene.params[5];
	} else {
		highestVal = mathScene.params[2];
	}
	while (highestVal > 0) {
		highestVal = Math.floor(highestVal/10);
		p++;
	}
	mathScene.params[0] = p;
	if (mathScene.params[0] >= 4) {
		mathScene.params[8] = mathScene.params[0];
	} else {
		mathScene.params[8] = 4;
	}
	grobjects = [];
	mathScene.buttons = [];
	mathScene.problems = [];
	mathScene.answers = [];
	mathScene.abacus.poles = [];
	grobjects = [];
	var test2 = new TexturedPlane(1);
	test2.position[1] = 3;
	test2.scale = [1.0, 1.0];
	grobjects.push(test2);
	var i;
	for (i = 0; i < 10; i++) {
		mathScene.buttons.push(new DigitBox(i,0));
	}
	mathScene.buttons.push(new DigitBox(0,0));
	mathScene.buttons.push(new DigitBox(1,0));
	grobjects.push(mathScene.buttons[0]);
	mathScene.selected = new DigitBox(0,1);

	for (i = 0; i < mathScene.params[0]; i++) {
		mathScene.answers.push(new DigitBox(0,2));
	}
	for (i = 0; i <= mathScene.params[0]*2+1; i++) {
		mathScene.problems.push(new DigitBox(0,4));
	}
	
	//Poles
	for (i = 0; i < mathScene.params[0]; i++) {
		mathScene.abacus.poles.push(new DigitBox(0,5));
	}
	mathScene.abacus.ballPos = [];
	for (var i = 0; i < mathScene.params[0]*10; i++) {
		mathScene.abacus.ballPos.push(0.0);
	}
	createProblem();
}
