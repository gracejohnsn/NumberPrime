var grobjects = grobjects || [];
var TexturedPlane = undefined;
var DigitBox = undefined;
var selectBox;
var dBoxes = [];
var answers = [];
var problems = [];
var probState = 0;
var answer = 0;
var lastX;
var lastY;
    var image = new Image();
    image.src = "Textures/UI.png";
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
	   this.offset = [0,0,0];
	   this.color = [0.0,0.0,0.0];
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
        var cM = twgl.m4.lookAt([0.5,0.5,0.825],[0.5,0.5,0.0],[0,1,0]);
        var vM = twgl.m4.inverse(cM);
		twgl.setUniforms(shaderProgram,{
            view:vM, proj:drawingState.proj,
             model: modelM, uTexture : this.texture,
		  offset : this.offset, color : this.color });

	twgl.setBuffersAndAttributes(gl,shaderProgram,bgBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, bgBuffer);
    }

     	DigitBox = function (digit,type) {
	   this.type = type;
        this.name = "DigitBox"+digit + "" + type;
        this.position = [0.0,0.0,0.03];
        this.scale = [1,1];
        this.texture = null;
	   this.digit = digit;
	   this.state = 0;
	   this.color = [0.0,0.0,0.0];
	this.offset = [.125*(this.digit%4),
-.125*Math.floor(this.digit/4.0)
,0.002];
	switch (this.type) {
	case 0 : 
		if (digit > 0) {
this.position = [(.15*((this.digit-1.0)%3)),-.10*Math.floor((this.digit-1.0)/3.0),0.005];
		} else {
		this.position = [.15,-.3,.003];
		}
		break;
	case 1 : 	
		this.position = [0.25,0.25,-0.001];
		break;
	case 2 :  
		this.color = [0.0,0.0,0.0];
		this.position = [0.475+.15*answers.length,-0.05,0.003];
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
		this.position = [0.5+.20*this.digit,-.20,0.003];
		this.scale[0] = 1.25;
		break;
	case 4 : {
		this.position = [0.075+.15*problems.length,0.35,0.003];
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
         0.05, 0.45,  0.003,
         0.20, 0.45,  0.003,
         0.05, 0.35,  0.003,

         0.05,  0.35,  0.003,
         0.20,  0.35,  0.003,
         0.20,  0.45,  0.003,
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
       0.5,   1.0,
       0.625, 1.0,
       0.5,   0.875,

       0.5,    0.875,
       0.625,  0.875,
       0.625,  1.0,
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
	    if (this.position[0] < lastXY[0] - .05 && 
		  this.position[0] > lastXY[0] - .20) {
			if (this.position[1] > -1.0*(lastXY[1] - .55) && this.position[1] > -1.0*(lastXY[1] - .55) - .10) {
			return 1;
			}
		}
		return 0;
	}


	var evaluateProblem = function(type) {
	var i = 0;
	var prob = "";
	probState = 0;
	for (i = 0; i < problems.length; i++) {
	prob += problems[i].digit;
	}
	}

	var createProblem = function(type) {
			var curr;
			probState = 1;
			var place = 10;
			var nums = [Math.floor(Math.random()*98.0) + 1.0,Math.floor(Math.random()*98.0) + 1.0];
			answer = nums[0] + nums[1];
			console.log(answer);
			for (var i = 0; i < 5; i++) {
			if (i < 2) {
			curr = Math.floor(nums[0]/place);
problems[i].updateDigit(dBoxes[curr].offset,dBoxes[curr].digit);			nums[0] = nums[0]%place;
			place = place/10;
			} else if (i > 2) {
			curr = Math.floor(nums[1]/place);
problems[i].updateDigit(dBoxes[curr].offset,dBoxes[curr].digit);
			nums[1] = nums[1]%place;
			place = place/10;
			}
			else {
			place = 10;
		problems[i].updateDigit(dBoxes[type].offset,"+");
			problems[i].offset[1] -= .375;
			}
			}
}


    DigitBox.prototype.draw = function (drawingState) {
     var gl = drawingState.gl;
	var lastXY = drawingState.lastXY;
	switch(this.type) {
	//Selectable Section
	 case 0 : 
	if (lastXY[3] == 1) {
	   var c = this.checkHitbox(lastXY);
		if (c == 1) {
			selectBox.state = 1;
			selectBox.position = this.position;
			selectBox.updateDigit(this.offset,this.digit);
			}
	}
			break;
	//Draggable/Droppable Selection
	 case 1 : 	
			if (selectBox.state == 1)
			this.position = [lastXY[0]-.15,-1.0*lastXY[1]+.60,0.003];
			break;
	//Droppable Section
	 case 2 : 
		var c = this.checkHitbox(lastXY);
		if (c == 1 && selectBox.state == 1 && lastXY[2] == 0) {
			this.updateDigit(selectBox.offset,selectBox.digit);
			selectBox.position[2] = -0.03;
			selectBox.state = 0;
			}
			break;
	case 3 : 
		if (lastXY[3] == 1) {
		if (this.checkHitbox(lastXY) && lastXY[3] == 1) {
			probState = 2;
			for (var k = 0; k < 3; k++) {
			answers[k].updateDigit(dBoxes[0].offset,0);
			}
		}
		}
	//Other??
	 default : break; 
	}
	   var modelM = twgl.m4.scaling([this.scale[0],this.scale[1],1.0]);
       twgl.m4.setTranslation(modelM,this.position,modelM);
//	 twgl.m4.translate(modelM,this.offset,modelM);
        gl.useProgram(shaderProgram.program);
if (this.texture == null) { 
this.texture = createGLTexture(gl, image, true);
}
        var cM = twgl.m4.lookAt([0.5,0.5,.825],[0.5,0.5,0.0],[0,1,0]);
        var vM = twgl.m4.inverse(cM);
		twgl.setUniforms(shaderProgram,{
            view:vM, proj:drawingState.proj,
             model: modelM, uTexture : this.texture,
		  offset : this.offset, color : this.color});

	twgl.setBuffersAndAttributes(gl,shaderProgram,digitBuffer);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, digitBuffer);
	if (this.position[0] == problems[0].position[0])
	if (probState == 0) {
		createProblem(0);
	} else if (probState == 1) {

	} else {
		evaluateProblem();
	}
    }


    var test = new TexturedPlane();
        test.position[1] = 3;
        test.scale = [1.0, 1.0];
    grobjects.push(test);

var i = 0;
for (i = 0; i < 10; i++) {
dBoxes.push(new DigitBox(i,0));
grobjects.push(dBoxes[i]);
}
//
selectBox = new DigitBox(0,1);
grobjects.push(selectBox);
//
for (i = 0; i < 3; i++) {
answers.push(new DigitBox(0,2));
grobjects.push(answers[i]);
}
answers.push(new DigitBox(0,3));
grobjects.push(answers[3]);
answers.push(new DigitBox(1,3));
grobjects.push(answers[4]);
for (i = 0; i < 5; i++) {
problems.push(new DigitBox(0,4));
grobjects.push(problems[i]);
}
problems[0].state = 1;
createProblem(0);


})();