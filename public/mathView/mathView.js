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
 	var userPromise = User.readUserData(firebase, uid);
  	var scopePromise = new Promise(
    		function(resolve, reject) {
      		resolve($scope);
  		  }
  	);
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
	$routeParams.max1 + "/" + $routeParams.min1 + "/" + $routeParams.mult1 + "/" +
	$routeParams.max2 + "/" + $routeParams.min2 + "/" + $routeParams.mult2;
	$scope.params = sP;
	$scope.num1 = 0;
	$scope.num2 = 0;
	$scope.correct = 0;
	$scope.totalCorrect = 0;
	$scope.probNum = 0;
	$scope.problemSet = [];
	$scope.writeProblem = function() {
	var time = new Date();
	var probType;
	var probSymbol;
	switch ($routeParams.type) {
		case "0" : 
			probType = "Addition";
			probSymbol = "+";
			break;
		case "1" :
			probType = "Subtraction";
			probSymbol = "-";
			break;
		case "2" : 
			probType = "Multiplication";
			probSymbol = "*";
			break;
		case "3" :
			probType = "Division";
			probSymbol = "/";
			break;
		default :
			probType = "Math";
			probSymbol = "?";
			break;
	}
	var pNums = [];
	var pAns = [];
	var sAns = [];
	console.log($scope.problemSet);
	for (var i = 0; i < 10; i++) {
		pNums.push($scope.problemSet[i][0]+probSymbol+$scope.problemSet[i][1]);
		pAns.push($scope.problemSet[i][2]);
		sAns.push($scope.problemSet[i][3]);
	}
	ProblemInstance.createProblemInstance(firebase, uid, probType, $scope.totalCorrect, 10, pNums, sAns, pAns,  time, $scope.probURL);
	Notification.setCompleteProblem(firebase,currPsId,uid,time);
	completedRecentPS = 1;
	}
	$scope.problemSetDone = function() {
	window.location.href = "#!/Dashboard";
	}
	}]);