'use strict';

var math = angular.module('math', ['ngRoute']);
math.
  component('math', {
    templateUrl: 'mathView/mathView.template.html',
    controller: 'mathCtrl'
  });

math.controller('mathCtrl',["$scope", "$routeParams",
      function($scope, $routeParams) {
	var uid = firebase.auth().currentUser.uid;
	var classId = firebase.auth().currentUser;
	console.log(classId);
	$scope.test = ["one","two","three"];
	$scope.test2 = ["1","2","3"];
 	var userPromise = User.readUserData(firebase, uid);
  	var scopePromise = new Promise(
    		function(resolve, reject) {
      		resolve($scope);
  		  }
  	);
	console.log(userPromise);
        $scope.first = $routeParams.nDigs;
	var sP = "";
	sP = sP.concat($routeParams.nDigs+",");
	sP = sP.concat($routeParams.type+",");
	sP = sP.concat($routeParams.max1+",");
	sP = sP.concat($routeParams.min1+",");
	sP = sP.concat($routeParams.mult1+",");
	sP = sP.concat($routeParams.max2+",");
	sP = sP.concat($routeParams.min2+",");
	sP = sP.concat($routeParams.mult2+",");
	$scope.probURL = "#!/MathFacts/" + $routeParams.type + "/" +
	$routeParams.max + "/" + $routeParams.min + "/" + $routeParams.mult + "/" +
	$routeParams.max2 + "/" + $routeParams.min2 + "/" + $routeParams.mult2;
	$scope.params = sP;
	$scope.num1 = 0;
	$scope.num2 = 0;
	$scope.correct = 0;
	$scope.totalCorrect = 0;
	$scope.probNum = 0;
	$scope.writeProblem = function() {
	var time = new Date();
	ProblemInstance.createProblemInstance(firebase, uid, $routeParams.type, $scope.totalCorrect, 10,  time, $scope.probURL);
	}
	$scope.problemSetDone = function() {
	window.location.href = "#!/Dashboard";
	}
	}]);