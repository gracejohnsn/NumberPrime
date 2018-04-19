'use strict';

var sDash = angular.module('studentdash', ['ngRoute']);
sDash.
  component('studentdash', {
    templateUrl: 'studentView/studentView.template.html',
        controller: 'studentCtrl'
  });

sDash.controller('studentCtrl',["$scope", 
	function($scope) {
	var uid = firebase.auth().currentUser.uid;
	User.readUserData(firebase, uid)
		.then((userData)=> {
	$scope.user = userData;
	$scope.$apply();
	});
  	var scopePromise = new Promise(
    		function(resolve, reject) {
      		resolve($scope);
  		  }
  	);
	var time = Date.now();
	var temp;
	//$scope.notes = Notification.readNotifications(firebase,uid);
	Notification.readNotifications(firebase,uid)
		.then((notifications)=> {
	$scope.notes = notifications;
	$scope.$apply();
	console.log($scope.notes);
	});
	$scope.id = uid;
	}]);