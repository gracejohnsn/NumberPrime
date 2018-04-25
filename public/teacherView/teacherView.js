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
		$scope.param = [0,0,0,0,0,0,0,""];
		$scope.examples = [
			"1+2=3", "2+5=7",
		];
		
		
		$scope.createExamples = function(params) {
			$scope.examples = [];
			var paramFill = 1;
			for (var i = 0; i < 7; i++) {
			if (params[i] == null) {
				paramFill = 0;
				var missingType;
				switch (i) {
					case 0 : 
						missingType = "Type of Problem";
						break;
					case 1 : 
						missingType = "1st Value Max Value";
						break;
					case 2 : 
						missingType = "1st Value Min Value";
						break;
					case 3 : 
						missingType = "1st Value Multiples Of";
						break;
					case 4 : 
						missingType = "2nd Value Max Value";
						break;
					case 5 : 
						missingType = "2nd Value Min Value";
						break;
					case 6 : 
						missingType = "2nd Value Multiples Of";
						break;			
					default : 
						missingType = "Unknown";
						break;			
				}
 				$scope.examples.push("Missing Parameter : " + missingType);
				}
			}
			if (!paramFill)
				return;
			var type, max, min, mult,max2,min2,mult2,bot,top,diff,n1,n2,answer;
			var problem = [0,0,0,0];
			for (var i = 0; i < 10; i++) {
				var cProb = "";
				type = parseInt(params[0]);
				max = parseInt(params[1]);
				min = parseInt(params[2]);
				mult = parseInt(params[3]);
				max2 = parseInt(params[4]);
				min2 = parseInt(params[5]);
				mult2 = parseInt(params[6]);
				bot = min/mult;
				top = Math.floor(max/mult);
				if (bot != Math.floor(bot)) {
					bot = Math.floor(bot)+1;
				}
				diff = top-bot+1;
				n1 = Math.floor(Math.random()*diff)+bot;
				bot = min2/mult2;
				top = Math.floor(max2/mult2);
				if (bot != Math.floor(bot)) {
					bot = Math.floor(bot)+1;
				}
				diff = top-bot+1;
				n2 = Math.floor(Math.random()*diff)+bot;
				problem[0] = (n1)*mult;
				problem[1] = (n2)*mult2;
				cProb = cProb.concat(problem[0]+"");
				problem[2] = type;
				switch (type) {
					case 0 : problem[2] = problem[0] + problem[1];
							cProb = cProb.concat("+");
						break;
					case 1 :
					if (problem[0] < problem[1]) {
						var temp = problem[0];
						problem[0] = problem[1];
						problem[1] = temp;
					} 
						problem[2] = problem[0] - problem[1];
						cProb = cProb.concat("-");
						break;
					case 2 : 
						problem[2] = problem[0] * problem[1];
						cProb = cProb.concat("*");
						break;
					case 3 :
						var r = problem[0]/problem[1];
						r = Math.floor(r)+1;
						problem[0] = r*problem[1]; 
						cProb = problem[0]+"/";
						problem[2] = problem[0] / problem[1];
						break;
				}
				cProb = cProb.concat(problem[1]+"="+problem[2]);
				$scope.examples.push(cProb);
				$scope.$apply;
			}
		}

		$scope.update = function (params) {
			$scope.param = angular.copy(params);
			$scope.probURL = "#!/MathFacts/" + $scope.param[0] + "/" +
				$scope.param[1] + "/" + $scope.param[2] + "/" + $scope.param[3] + "/" +
				$scope.param[4] + "/" + $scope.param[5] + "/" + $scope.param[6];
			var time = new Date();
			//	var cID = $scope.user.classId;
			//	console.log("ClassID=" + cID);
			alert("Created Notification : " + $scope.probURL);
			Notification.createNotification(firebase, uid, $scope.probURL, "student", time, time, $scope.param[7]);
		};
		firebase.auth().onAuthStateChanged(
			function(user) {
				if (user) {
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
							if ('teacher' != userData.type) {
								//window.location = "/#!/Dashboard";
							}
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
						$scope.probURL = "#!/MathFacts/" + $scope.param[0] + "/" +
							$scope.param[1] + "/" + $scope.param[2] + "/" + $scope.param[3] + "/" +
							$scope.param[4] + "/" + $scope.param[5] + "/" + $scope.param[6];
						var time = new Date();
						//	var cID = $scope.user.classId;
						//	console.log("ClassID=" + cID);
						Notification.createNotification(firebase, uid, $scope.probURL, "student", time, time, $scope.param[7]);
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
				} else {
					window.location = "/#!/Login";
				}
			}
		);
		
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