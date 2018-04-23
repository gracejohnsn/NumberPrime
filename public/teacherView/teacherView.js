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
	console.log($scope.user);
	$scope.$apply();
	});
	$scope.update = function(params) {
	$scope.param = angular.copy(params);
	console.log($scope.param);
	 $scope.probURL = "#!/MathFacts/"+$scope.param.type+"/"+
	 $scope.param.max+"/"+$scope.param.min+"/"+$scope.param.mult+"/"
	 +$scope.param.max2+"/"+$scope.param.min2+"/"+$scope.param.mult2;
	console.log($scope.probURL);
	var time = new Date();
//	var cID = $scope.user.classId;
//	console.log("ClassID=" + cID);
	Notification.createNotification(firebase,uid,$scope.probURL,"student",time,time,$scope.param.msg);
	};
	}]);