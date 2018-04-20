'use strict';

var sDash = angular.module('studentdash', ['ngRoute']);
sDash.
  component('studentdash', {
    templateUrl: 'studentView/studentView.template.html',
        controller: 'studentCtrl'
  });

sDash.controller('studentCtrl',["$scope", 
	function($scope) {
<<<<<<< HEAD
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
=======
		//alert("Hello");
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				var uid = user.uid;
				//alert(uid);
				var dataPromise = User.readUserData(firebase, uid).then(
					function(result) {
						if ('student' != result.type) {
							alert("Not a student user!");
						}
						$scope.$apply(
							function() {
								$scope.user = result;

								// populate with class notifications
								Notification.readNotifications(firebase,result.classId).then(
									function(result) {
										$scope.$apply(
											function() {
												if ($scope.notes == undefined || $scope.notes == null) {
													$scope.notes = [];
												}
												$scope.notes = $scope.notes.concat(result);
											}
										);
									}
								).catch(
									function(err) {
										console.log(err);
									}
								);
							}
						);
					},
					function(err) {
						alert(err);
					}
				);
				
				// populate with user notifications
				Notification.readNotifications(firebase,uid).then(
					function(result) {
						$scope.$apply(
							function() {
								if ($scope.notes == undefined || $scope.notes == null) {
									$scope.notes = [];
								}
								$scope.notes = $scope.notes.concat(result);
							}
						);
					}
				).catch(
					function(err) {
						console.log(err);
					}
				);
				
			} else {
			  // No user is signed in.
				var provider = new firebase.auth.GoogleAuthProvider();
				provider.setCustomParameters({
					prompt: 'select_account'
				});
				/*firebase.auth().signInWithRedirect(provider).then(
				firebase.auth().getRedirectResult()
				);*/
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
				firebase.auth().signInWithRedirect(provider)).then(
				firebase.auth().getRedirectResults()
				);
			}
		  });
		  

		/*var scopePromise = new Promise(
				function(resolve, reject) {
				resolve($scope);
			}
		);*/
		/*var time = Date.now();
		var temp;
		//$scope.notes = Notification.readNotifications(firebase,uid);
		Notification.readNotifications(firebase,uid).then((notifications)=> {
			$scope.notes = notifications;
			$scope.$apply();
			console.log($scope.notes);
		});
		$scope.id = uid;*/
	}
]);

function logout() {
	firebase.auth().signOut();
	window.location = "/#!/Login";
}
>>>>>>> 41754cd2583148ddd308e68e0fefbd1dca7747f5
