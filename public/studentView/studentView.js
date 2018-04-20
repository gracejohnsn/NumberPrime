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
	var cId = "1234";
	User.readUserData(firebase, uid)
		.then((userData)=> {
	$scope.user = userData;
	cId = $scope.user.classId;
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
	var uNote = Notification.readNotifications(firebase,uid);
	var cNote = Notification.readNotifications(firebase,cId);
	Promise.all([uNote,cNote]).then((results)=> {
	console.log(results);
	$scope.notes = results[0];
	$scope.notes = $scope.notes.concat(results[1]);
	$scope.$apply();
	});
/*
//		.then((notifications)=> {
//	$scope.notes = notifications;
//	$scope.$apply();
//	console.log($scope.notes);
//	});
//	Notification.readNotifications(firebase,uid)
		.then((classNotifications)=> {
	//$scope.cNotes = classNotifications;
	$scope.$apply();
	console.log($scope.cNotes);
	});
*/
	$scope.id = uid;
	}]);