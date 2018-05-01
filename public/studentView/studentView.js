'use strict';

var currPsId = undefined;
var completedRecentPS = 0;

var sDash = angular.module('studentdash', ['ngRoute']);
sDash.
component('studentdash', {
	templateUrl: 'studentView/studentView.template.html',
	controller: 'studentCtrl'
});

sDash.controller('studentCtrl', ["$scope",
	function ($scope) {
		$scope.orderSets = 'timeStamp';
		$scope.reverse = 'false';
		if (!$scope.curr) {
			$scope.curr = 0;
		}
		$scope.sortBy = function(orderSets) {
			$scope.reverse = ($scope.orderSets == orderSets) ? !$scope.reverse : false;
			$scope.orderSets = orderSets;
			$scope.$apply;
		  };
		
		$scope.updatePsId = function(newId) {
			currPsId = newId;
			alert(currPsId);
		}

		$scope.exitPSReview = function() {
				$scope.completedRecentPS = 0;
				completedRecentPS = 0;
		}
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				var uid = user.uid;
				//alert(uid);
				var dataPromise = User.readUserData(firebase, uid).then(
					function (result) {
						if ('student' != result.type) {
							window.location = "/#!/DashboardTeach";
						}
						$scope.$apply(
							function () {
								$scope.user = result;

								// populate with class notifications
								Notification.readNotifications(firebase, result.classId).then(
									function (result) {
										$scope.$apply(
											function () {
												if ($scope.notes == undefined || $scope.notes == null) {
													$scope.notes = [];
												}
												$scope.notes = $scope.notes.concat(result);
											}
										);
									}
								).catch(
									function (err) {
										console.log(err);
									}
								);
							}
						);
					},
					function (err) {
						alert(err);
					}
				);

				// populate with user notifications
				Notification.readNotifications(firebase, uid).then(
					function (result) {
						$scope.$apply(
							function () {
								if ($scope.notes == undefined || $scope.notes == null) {
									$scope.notes = [];
								}
								$scope.notes = $scope.notes.concat(result);
							}
						);
					}
				).catch(
					function (err) {
						console.log(err);
					}
				);

				//Populate with Finished Problem Sets
				ProblemInstance.readProblemInstance(firebase,uid,10).then(
					function(result) {
						$scope.$apply(
							function() {
								$scope.completePS = result;
								$scope.recentPS = result[0];
								$scope.completedRecentPS = completedRecentPS;
								for (var i = 0; i < $scope.completePS.length; i++) {
									var cPS = $scope.completePS[i];
									cPS.score = (cPS.totalCorrect*100/cPS.totalProblems);
									cPS.timeStamp = new Date(cPS.timeStamp);
								}
							}
						);
					}
				).catch(
					function(err) {
						console.log(err);
					}
				);

			} else {
				window.location = "/#!/Login";
				// No user is signed in.
				/*var provider = new firebase.auth.GoogleAuthProvider();
				provider.setCustomParameters({
					prompt: 'select_account'
				});

				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
				firebase.auth().signInWithRedirect(provider)).then(
				firebase.auth().getRedirectResults()
				);*/
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