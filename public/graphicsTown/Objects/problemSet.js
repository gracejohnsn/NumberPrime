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

if (numDigits < 4) {
 scaleDigits = 4;
}

for (var i = 0; i < 100; i++) {
	posBalls.push([-0.08/scaleDigits,0.0,0.005]);
}

var lastX;
var lastY;
var click = 0;
    var image = new Image();
    image.src = "graphicstown/Textures/UI.png";
//	image.src = "Textures/UI.png";
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
	var shaderProgram = undefined;
	var bgBuffer = undefined;
	var dgBuffer = undefined;
	var digitBuffer = undefined;
	var canvas = undefined;
     	TexturedPlane = function () {
        this.name = "TexturedPlane"
        this.position = [0,0,0];
        this.scale = [1,1];
        this.texture = null;
	   this.bgOff = [0.0,0.0];
	   this.offset = [0,0,0];
	   this.color = [1.0,1.0,1.0];
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

	aTexCoord2 : {numComponents: 2, data : [
       0.0, 1.0,
       0.5, 1.0,
       0.0, 0.5,

       0.0, 0.5,
       0.5, 0.5,
       0.5, 1.0,
	]},
	aTexCoord3 : {numComponents: 2, data : [
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
this.texture = createGLTexture(gl, image, true);
}
        var cM = twgl.m4.lookAt([0.5,0.5,0.9],[0.5,0.5,0.0],[0,1,0]);
        var vM = twgl.m4.inverse(cM);
		twgl.setUniforms(shaderProgram,{
            view:vM, proj:drawingState.proj,
             model: modelM, uTexture : this.texture,
		  offset : this.offset, color : this.color, bgOff : [0.0,0.0] });

	twgl.setBuffersAndAttributes(gl,shaderProgram,bgBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, bgBuffer);
    }

     	DigitBox = function (digit,type) {
	   this.type = type;
        this.name = "DigitBox"+digit + "" + type;
        this.position = [0.0,0.0,0.03];
        this.scale = [0.5,1];
        this.texture = null;
	   this.digit = digit;
	   this.state = 0;
	   this.color = [1.0,1.0,1.0];
	this.bgOff = [0.0,0.0];
	this.offset = [.125*(this.digit%4),
-.125*Math.floor(this.digit/4.0)
,0.002];
	switch (this.type) {
	case 0 : 
		if (digit > 0) {
this.position = [(.1+.075*((this.digit-1.0)%3)),0.4-.10*Math.floor((this.digit-1.0)/3.0),0.005];
		} else {
		this.position = [.175,0.1,.003];
		}
		break;
	case 1 : 	
		this.position = [0.35,0.35,-0.03];
		break;
	case 2 :  
		this.color = [1.0,1.0,1.0];
		this.scale[0] = 2.0/scaleDigits;
		this.position = [.13+.15*this.scale[0]*answers.length,0.65,0.003];
		this.offset = [0.0,0.0,0.0];
				break;
	case 3 :
		if (this.digit == 0) { 
		this.color = [0.5,0.2,0.2];
		}
		else { 
		this.color = [0.2,0.5,0.2];
		}
		this.offset = [.125*(this.digit+2),-.25,0.0];
		this.position = [0.4,.15+.2*this.digit,0.003];
		this.scale[0] = 1.0;
		this.scale[1] = 2.0;
		break;
	case 4 : 
		this.position[2] = -.003;
		this.bgOff = [0.75,0.0];
		this.scale[0] = 2.0/scaleDigits;
		break;
	case 5 : {
	this.scale = [1.0/scaleDigits,9.0,0.0];
	this.position = [.55+(.4/scaleDigits)*poles.length, 0.5,0.003];
	this.offset = [0.0,-0.5,0.0];
	break;
	}
	default : break;
	  }
    }

    DigitBox.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
	   if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["tex-vs", "tex-fs"]);
        }
        
var digitbox = {
	aPosition : {numComponents: 3, data : [
         -0.075, 0.05,  0.003,
         0.075, 0.05,  0.003,
         -0.075, -0.05,  0.003,

         -0.075,  -0.05,  0.003,
         0.075,  -0.05,  0.003,
         0.075,  0.05,  0.003,
	]},
//BackGround Texture
	aTexCoord : {numComponents: 2, data : [
       0.0, 0.5,
       0.25, 0.5,
       0.0, 0.25,

       0.0, 0.25,
       0.25, 0.25,
       0.25, 0.5,
	]},
//Digit/Text Texture
	aTexCoord2 : {numComponents: 2, data : [
       0.51,   0.99,
       0.624, 0.99,
       0.51,   0.875,

       0.51,    0.875,
       0.624,  0.875,
       0.624,  0.99,
	]},
//Color Texture
     aTexCoord3 : {numComponents:2, data : [
	 0.0, 0.0,
	 1.0, 0.0,
	 0.0, 1.0,
	 
	 0.0,1.0,
	 1.0,1.0,
	 1.0,0.0,
      ]},
	};
digitBuffer = twgl.createBufferInfoFromArrays(drawingState.gl,digitbox);


};
    DigitBox.prototype.center = function () {
        return this.position;
    }

    DigitBox.prototype.updateDigit = function(offset,digit) {
	this.offset[0] = offset[0];
	this.offset[1] = offset[1];
	this.offset[2] = offset[2];
	this.digit = digit;
    }

    DigitBox.prototype.checkHitbox = function(lastXY) {
	var lY = 1.0 - lastXY[1];
	var lX = lastXY[0]; 
	    if (this.position[0]- .075*this.scale[0] < lX && 
		  this.position[0] + .075*this.scale[0] > lX) {
			if (this.position[1]-.05*this.scale[1] < lY && (this.position[1] + .05*this.scale[1] > lY)) {
			return 1;
			}
		}
		return 0;
	}
	
	var evaluateProblem = function() {
	var ansArray = [];
	console.log(answer);
	for (var i = 0; i < numDigits; i++) {
	ansArray.push(answers[i].digit);
	}
	var a = ansArray.join('');
	if (a == answer) return 1;
	else return 0;
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
		selectBox.updateDigit(curBox.offset,curBox.digit);
		selectBox.position = (curBox.position);
		selected = 1;
		break;
		}
	}
	if (answers[numDigits].checkHitbox(lastXY) == 1) {
		for (var i = 0; i < numDigits; i++) {
	answers[i].updateDigit(dBoxes[0].offset,dBoxes[0].digit);
	poles[i].digit = 0;
		}
	}
	if (answers[answers.length-1].checkHitbox(lastXY) == 1) {
		if (evaluateProblem() == 1) { 
				createProblem(type);
		}
		for (var i = 0; i < numDigits; i++) {
	answers[i].updateDigit(dBoxes[0].offset,dBoxes[0].digit);
	poles[i].digit = 0;
		}

		}
	}
//Update AnswerBoxes
	if (selected == 1 && lastXY[2] == 0) {
		for (var i = 0; i < numDigits; i++) {
		if (answers[i].checkHitbox(lastXY) == 1) {
	answers[i].updateDigit(selectBox.offset,selectBox.digit);
		selectBox.position = [0.0,0.0,-0.03];
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
		console.log(posBalls[it][1]);
		if ((posBalls[it])[1] -.05 <= (1.0-lastXY[1])) {
			dig = it-(i*9)+1;
			console.log(dig);
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
var modelM;
var cBox;
var ind;
for (ind = 0; ind < dBoxes.length; ind++) {
cBox = dBoxes[ind];
	if (cBox.type == 1 && selected == 1) {
	cBox.position = [lastXY[0],1.0-lastXY[1],0.003];
	}
		   modelM = twgl.m4.scaling([cBox.scale[0],cBox.scale[1],1.0]);

twgl.m4.setTranslation(modelM,cBox.position,modelM);
		twgl.setUniforms(shaderProgram,{
            view:vM, proj:drawingState.proj,
            model: modelM, uTexture : this.texture,
		 offset : cBox.offset, color : cBox.color, 			bgOff : cBox.bgOff });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer);
}

//Draw Abacus
for (ind = 0; ind < numDigits; ind++) {
cBox = poles[ind];
		   modelM = twgl.m4.scaling([cBox.scale[0],cBox.scale[1],1.0]);
twgl.m4.setTranslation(modelM,cBox.position,modelM);
		twgl.setUniforms(shaderProgram,{
            view:vM, proj:drawingState.proj,
            model: modelM, uTexture : this.texture,
		 offset : cBox.offset, color : cBox.color,bgOff : [0.0,0.0] });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer);
}




var cPole;
var cBalls;
var cBall;
var ballOff = [-.5,0.5,0.0];
var blockClrs = [1,0,0, 0,1,0,
			0,0,1, 1,1,1,
			1,1,0, 1,0,1,
			0,1,1, 1,1,1];
var blockClr = [0.0,0.0,0.0];
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
	blockClr[0] += blockClrs[ind*3]*.1;
	blockClr[1] += blockClrs[ind*3+1]*.1;
	blockClr[2] += blockClrs[ind*3+2]*.1;
	cBall = posBalls[9*ind+j];
	if (j < cPole.digit) {
		if (cBall[1] >= 0.1+0.07*j) {
		cBall[1] -= .01;
		}
	} else {
		if (cBall[1] < 0.3+0.07*j) {
		cBall[1] += .01;
		
	}
	}
		modelM = twgl.m4.scaling([2.0/scaleDigits,0.7,1.0]);
	twgl.m4.setTranslation(modelM,[cPole.position[0],cBall[1],cBall[2]],modelM);
		twgl.setUniforms(shaderProgram,{
            view:vM, proj:drawingState.proj,
            model: modelM, uTexture : this.texture,
		 offset : ballOff, bgOff : [0.251,-0.001], color : 			blockClr});
        twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer);
    }
}

}


})();

var createProblem = function(type) {
			console.log("createProblem");
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
			prob[0] = n1*mult;
			prob[1] = n2*mult;
			var ans;
			var curr;
			probState = 1;
			var place = Math.pow(10,numDigits-1);
//			prob[0] = Math.floor(Math.random()*(place-1)) + 1.0;
//			prob[1] = Math.floor(Math.random()*(place-1)) + 1.0;
			prob[2] = type;
			console.log("Switch");
			switch (type) {
			case 0 : answer = prob[0] + prob[1];
				break;
			case 1 :
			console.log("SUB");
			console.log(prob[0])
			console.log(prob[1]);
			if (prob[0] < prob[1]) {
				console.log("Switch" + prob[0] + " " + prob[1]);
				var temp = prob[0];
				prob[0] = prob[1];
				prob[1] = temp;
				console.log("Switch" + prob[0] + " " + prob[1]);
			} 
				answer = prob[0] - prob[1];
				break;
			case 2 : answer = prob[0] * prob[1];
				break;
			case 3 :  answer = prob[0] / prob[1];
				break;
			}

		var cDig;
	for (var row = 0; row < 2; row++) {
		for (var i = 0; i < numDigits; i++) {
		cDig = Math.floor(prob[row]/place);
	problems[numDigits*row+i].updateDigit(dBoxes[cDig].offset,dBoxes[cDig].digit);
		problems[numDigits*row+i].position = [.13+.15*problems[0].scale[0]*i,0.85-.1*row,0.003];
		prob[row] = prob[row]%place;
		place = place/10;
		}
		place = Math.pow(10,numDigits-1);
		}
		var x = problems[0].position[0];
		problems[numDigits*2+1].position = [x-.05,.75,0.003];
		problems[numDigits*2+1].offset = [0.0125+.125*type,-0.375,0.0];
}


var setupPS = function(nD) {
"use strict";
console.log("SETUP");
console.log(nD);
var arr = nD.split(",");
console.log(arr);
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
var test = new TexturedPlane();
test.position[1] = 3;
test.scale = [1.0, 1.0];
grobjects.push(test);

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
for (i = 0; i < 8; i++) {
poles.push(new DigitBox(0,5));
//dBoxes.push(poles[i]);
}
console.log("Everything Pushed");
console.log(dBoxes.length);
createProblem(type);
}
