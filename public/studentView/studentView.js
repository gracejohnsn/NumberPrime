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
		var uid = firebase.auth().currentUser.uid;
		//alert(uid);
		$scope.user = {firstName: "",surName: ""}
		var dataPromise = User.readUserData(firebase, uid).then(
			function(result) {
				$scope.$apply(
					function() {
						$scope.user = result;
						//alert(result);
					}
				);
			},
			function(err) {
				alert(err);
			}
		);
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