'use strict';

var tDash = angular.module('teacherdash', ['ngRoute']);
tDash.
  component('teacherdash', {
    templateUrl: 'teacherView/teacherView.html',
        controller: 'teacherCtrl'
  });

tDash.controller('teacherCtrl',["$scope", 
	function($scope) {
	console.log("Hello");
	$scope.param = {};
	var uid = firebase.auth().currentUser.uid;
	var userPromise = User.readUserData(firebase, uid);
  	var scopePromise = new Promise(
    		function(resolve, reject) {
      		resolve($scope);
  		  }
  	);
	User.readUserData(firebase, uid)
		.then((userData)=> {
	$scope.user = userData;
	$scope.$apply();
	});
	$scope.update = function(params) {
	$scope.param = angular.copy(params);
	console.log($scope.param);
 	$scope.probURL = "#!/MathFacts/"+$scope.param.nD+"/"+$scope.param.type+"/"+$scope.param.max+"/"+$scope.param.min+"/"+$scope.param.mult;
	console.log($scope.probURL);
	var time = new Date();
	Notification.createNotification(firebase,uid,$scope.probURL,"student",time,time,$scope.param.msg);
	};
	$scope.createProbSet = function() {
	var time = new Date();
	console.log(time);
	Notification.createNotification(firebase,uid,"#!/MathFacts/4/0/999/100/1","student",time,time,"Test");
	}
	}]);