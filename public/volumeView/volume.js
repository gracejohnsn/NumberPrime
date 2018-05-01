/*'use strict';

var app = angular.module('volume', ['ngRoute']);
angular.
  module('volume').
  component('volume', {
    templateUrl: 'volumeView/volume.html',
  });

app.controller('volume', function($scope) {

});
*/
'use strict';

var volume = angular.module('volume', ['ngRoute']);
volume.
  component('volume', {
    templateUrl: 'volumeView/volume.html',
  });

volume.controller('volumeController', ["$scope", "$routeParams",
  function ($scope, $routeParams) {

    $scope.correct = 0;
    $scope.report = "false";
    $scope.showReport = function (correct) {
      $scope.$apply(
        function () {
          $scope.correct = correct;
          $scope.report = "true";
          console.log($scope.report);
        }
      );
    }

    var uid = firebase.auth().currentUser.uid;
    $scope.probURL = "#!/volume/";
    $scope.volumeParams =
      parseInt($routeParams.max) + "," +
      parseInt($routeParams.min);
    $scope.writeVolumeSet = function (nCorrect, sAnswers, pQuestions, pAnswers) {
      var time = new Date();
      ProblemInstance.createProblemInstance(firebase, uid, "Volume", nCorrect, pQuestions.length, pQuestions, sAnswers, pAnswers, time, $scope.probURL);
      Notification.setCompleteProblem(firebase, currPsId, uid, time);
      completedRecentPS = 1;
    }
    //generates random number from 1 to 10
    function generateRandomNumber() {
      var maxV = (vParamsVal[0]);
      var minV = (vParamsVal[1]);
      if (maxV > 15) maxV = 15;
      if (minV < 1) minV = 1;
      if (volumeReady.value == 0) {
        maxV = 15;
        minV = 5;
      }
      var diffV = maxV - minV;
      var vNum = Math.round(Math.random() * diffV) + minV;
      return vNum;
      //   return Math.floor(Math.random() * 10) + 5;
    }
    function loadCanvas() {
      var canvas = document.getElementById("myCanvas");
      canvas.width = 1500;
      canvas.height = 450;
      $scope.ctx = canvas.getContext('2d');
      $scope.x1 = generateRandomNumber() * 10;;
      $scope.x2 = generateRandomNumber() * 10;;
      $scope.y = generateRandomNumber() * 10;;
      $scope.color = document.querySelector('#color');
      document.getElementById("num").innerHTML = problemNumber;

      // Animation function
      function draw() {
        var canvas = document.getElementById("myCanvas");
        // clear the canvas
        $scope.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Wobble the cube using a sine wave
        var wobble = (Math.sin(Date.now() / 250) * window.innerHeight / 50) / 5;

        // draw the cube
        drawCube(
          window.innerWidth / 2,
          window.innerHeight / 2 + wobble + $scope.y / 2 - 50,
          $scope.x1,
          $scope.x2,
          $scope.y,
          color.value
        );

        requestAnimationFrame(draw);
      }
      draw();

      // Colour adjustment function
      // Nicked from http://stackoverflow.com/questions/5560248
      function shadeColor(color, percent) {
        color = color.substr(1);
        var num = parseInt(color, 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R
          < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
          (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
      }

      // Draw a cube to the specified specs
      function drawCube(x, y, wx, wy, h, color) {
        var canvas = document.getElementById("myCanvas");
        $scope.ctx.fillStyle = "#F8F8F8";


        //shadeColor(color, 10)
        //right side of cube h x wy
        $scope.ctx.beginPath();
        $scope.ctx.moveTo(x, y); //a
        $scope.ctx.lineTo(x + wy, y - wy * 0.5); //f
        $scope.ctx.lineTo(x + wy, y - h - wy * 0.5); //e
        $scope.ctx.lineTo(x, y - h * 1); //d
        $scope.ctx.closePath();
        $scope.ctx.fillStyle = shadeColor(color, 10);
        $scope.ctx.strokeStyle = shadeColor(color, 50);
        $scope.ctx.stroke();
        $scope.ctx.fill();

        //shadeColor(color, -10)
        //left side of cube h x wx
        $scope.ctx.beginPath();
        $scope.ctx.moveTo(x, y); //a
        $scope.ctx.lineTo(x - wx, y - wx * 0.5); //b
        $scope.ctx.lineTo(x - wx, y - h - wx * 0.5); //c
        $scope.ctx.lineTo(x, y - h * 1); //d
        $scope.ctx.closePath();
        $scope.ctx.fillStyle = shadeColor(color, -10);
        $scope.ctx.strokeStyle = color;
        $scope.ctx.stroke();
        $scope.ctx.fill();

        //shadeColor(color, 20)
        //top side of cube wx x wy
        $scope.ctx.beginPath();
        $scope.ctx.moveTo(x, y - h); //d
        $scope.ctx.lineTo(x - wx, y - h - wx * 0.5); //c
        $scope.ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5)); //g
        $scope.ctx.lineTo(x + wy, y - h - wy * 0.5); //e
        $scope.ctx.closePath();
        $scope.ctx.fillStyle = shadeColor(color, 20);
        $scope.ctx.strokeStyle = shadeColor(color, 60);
        $scope.ctx.stroke();
        $scope.ctx.fill();

        $scope.ctx.font = "0.7em Arial";
        $scope.ctx.fillStyle = "#000";
        $scope.ctx.fillText(wy / 10 + "cm", ((x + x + wy) * 0.5), 15 + (y + y - wy * 0.5) * 0.5); //(a+f)/2
        $scope.ctx.font = "0.7em Arial";
        $scope.ctx.fillStyle = "#000";
        $scope.ctx.fillText(wx / 10 + "cm", ((x + x - wx) * 0.5) - 20, 19 + ((y + y - wx * 0.5) * 0.5));
        //(a+b)/2

        $scope.ctx.font = "0.7em Arial";
        $scope.ctx.fillStyle = "#000";
        $scope.ctx.fillText(h / 10 + "cm", ((x - wx + x - wx) * 0.5) - 50, midpoint(y - wx * 0.5, y -
          h - wx * 0.5));//(c+b)/2

        $scope.ctx.font = "200% Boogaloo";
        $scope.ctx.fillStyle = "#3B0B97";
        $scope.ctx.fillText(" What is the volume of this object?", (canvas.width / 4) + 100
          , 100);

      }

      function midpoint(x1, x2) {
        var b = x1 + x2;
        return b / 2;
      }
    }

    $scope.refresh = function () {
      var canvas = document.getElementById("myCanvas");
      $scope.ctx = canvas.getContext('2d');
      $scope.x1 = generateRandomNumber() * 10;
      $scope.x2 = generateRandomNumber() * 10;
      $scope.y = generateRandomNumber() * 10;
      $scope.color = document.querySelector('#color');
      draw();
    }

    //$(document).ready(load());
    //$("#myCanvas").load(loadCanvas());
    var counter = setInterval(function () {
      var check = document.getElementById("myCanvas");
      if (check) {
        loadCanvas();
        clearInterval(counter);
      }
    }, 100)
    //addEventListener('load', load(), false);
  }]);
