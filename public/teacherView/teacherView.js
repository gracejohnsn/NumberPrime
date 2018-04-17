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
	var uid = firebase.auth().currentUser.uid;
	var userPromise = User.readUserData(firebase, uid);
  	var scopePromise = new Promise(
    		function(resolve, reject) {
      		resolve($scope);
  		  }
  	);
	$scope.createProbSet = function() {
	var time = new Date();
	console.log(time);
	Notification.createNotification(firebase,uid,"#!/MathFacts/4/0/999/100/1","student",time);
	}
	}]);