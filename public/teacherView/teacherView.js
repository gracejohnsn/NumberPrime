'use strict';

var tDash = angular.module('teacherdash', ['ngRoute']);
tDash.
component('teacherdash', {
	templateUrl: 'teacherView/teacherView.html',
	controller: 'teacherCtrl'
});

tDash.controller('teacherCtrl', ["$scope",
	function ($scope) {
		/*$scope.students = {
			"blah": {
				email: "blah@gmail.com",
				firstName: "blah",
				surName: "lol"
			},
			"blah2": {
				email: "blah@gmail.com",
				firstName: "blah",
				surName: "lol"
			}
		};*/
		$scope.param = {};
		var uid = firebase.auth().currentUser.uid;
		var userPromise = User.readUserData(firebase, uid);
		var scopePromise = new Promise(
			function (resolve, reject) {
				resolve($scope);
			}
		);
		User.readUserData(firebase, uid)
			.then((userData) => {
				$scope.$apply(
					function () {
						$scope.user = userData;
						$scope.classes = [];
						$scope.students = [];
						$scope.currClass = "";
					}
				);
				if (Object.keys(userData.classList).length > 0) {
					$scope.$apply(
						function () {
							$scope.currClass = Object.keys(userData.classList)[0];
							console.log($scope.currClass);
						}
					);
				}

				// set users for table to be from class
				Class.readClassData(firebase, $scope.currClass).then(
					function (result) {
						for (var s in result.studentList) {
							User.readUserData(firebase, s).then(
								function (result) {
									$scope.$apply(
										function () {
											$scope.students = $scope.students.concat(result);
										}
									);
								}
							);
						}
					}
				);

				for (var c in userData.classList) {
					Class.readClassData(firebase, c).then(
						function (result) {
							$scope.$apply(
								function () {
									$scope.classes = $scope.classes.concat(result);
								}
							);
						}
					);
				}
			});
		$scope.update = function (params) {
			$scope.param = angular.copy(params);
			$scope.probURL = "#!/MathFacts/" + $scope.param.type + "/" +
				$scope.param.max + "/" + $scope.param.min + "/" + $scope.param.mult + "/" +
				$scope.param.max2 + "/" + $scope.param.min2 + "/" + $scope.param.mult2;
			var time = new Date();
			//	var cID = $scope.user.classId;
			//	console.log("ClassID=" + cID);
			Notification.createNotification(firebase, uid, $scope.probURL, "student", time, time, $scope.param.msg);
		};
		$scope.clickClass = function (classId) {
			$scope.currClass = classId;
			$scope.students = [];
			// set users for table to be from class
			Class.readClassData(firebase, $scope.currClass).then(
				function (result) {
					for (var s in result.studentList) {
						User.readUserData(firebase, s).then(
							function (result) {
								$scope.$apply(
									function () {
										$scope.students = $scope.students.concat(result);
									}
								);
							}
						);
					}
				}
			);
		}
	}
]);

function addStudent() {
	var code = document.getElementById('code').value;
	return User.readUserData(firebase, firebase.auth().currentUser.uid).then(
		function (result) {
			var classId = result.classList[0]; // TODO multiple class functionality?
			return Class.addStudentWithHash(firebase, code, classId);
		}
	);
}