'use strict';

var sDash = angular.module('studentdash', ['ngRoute']);
sDash.
  component('studentdash', {
    templateUrl: 'studentView/studentView.template.html',
        controller: 'studentCtrl'
  });

sDash.controller('studentCtrl',["$scope", 
	function($scope) {
		//alert("Hello");
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				var uid = user.uid;
				//alert(uid);
				var dataPromise = User.readUserData(firebase, uid).then(
					function(result) {
						$scope.$apply(
							function() {
								$scope.user = result;
							}
						);
					},
					function(err) {
						alert(err);
					}
				);
			} else {
			  // No user is signed in.
			  var provider = new firebase.auth.GoogleAuthProvider();
    		  firebase.auth().signInWithPopup(provider);
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