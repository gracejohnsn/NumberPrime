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
	console.log(userPromise);
        $scope.first = $routeParams.nDigs;
	var sP = "";
	sP = sP.concat($routeParams.nDigs+",");
	sP = sP.concat($routeParams.type+",");
	sP = sP.concat($routeParams.max+",");
	sP = sP.concat($routeParams.min+",");
	sP = sP.concat($routeParams.mult);
	$scope.params = sP;
	$scope.num1 = 0;
	$scope.num2 = 0;
	$scope.correct = 0;
	$scope.totalCorrect = 0;
	$scope.probNum = 0;
	$scope.writeProblem = function() {
	console.log("Write Prob");
	var time = Date.now();
	ProblemInstance.createProblemInstance(firebase, uid, "MultiDigit", $scope.correct,  time, {"num1" : $scope.num1, "num2" : $scope.num2, "operation" : "addition"});
	}
	$scope.problemSetDone = function() {
	window.location.href = "#!/Dashboard";
	}
	}]);