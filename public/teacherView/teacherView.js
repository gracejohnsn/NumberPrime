'use strict';

var tDash = angular.module('teacherdash', ['ngRoute']);
tDash.
	component('teacherdash', {
		templateUrl: 'teacherView/teacherView.html',
		controller: 'teacherCtrl'
	});

tDash.controller('teacherCtrl', ["$scope",
	function ($scope) {
		$scope.showPS = 0;
		$scope.orderSets = 'timeStamp';
		$scope.reverse = 'false';
		$scope.showClassList = 0;
		$scope.setList = function (type) {
			$scope.showClassList = type;
		}
		$scope.sortBy = function (orderSets) {
			$scope.reverse = ($scope.orderSets == orderSets) ? !$scope.reverse : false;
			$scope.orderSets = orderSets;
			$scope.$apply;
		};
		$scope.hidePS = function () {
			$scope.showPS = 0;
		}
		$scope.showStudentStats = function (idNum, name) {
			ProblemInstance.readProblemInstance(firebase, idNum, 10).then(
				function (result) {
					$scope.$apply(
						function () {
							$scope.completePS = result;
							for (var i = 0; i < $scope.completePS.length; i++) {
								var cPS = $scope.completePS[i];
								cPS.score = (cPS.totalCorrect * 100 / cPS.totalProblems);
								cPS.timeStamp = new Date(cPS.timeStamp).toLocaleString();
							}
							$scope.currName = name;
							$scope.showPS = 1;
						}
					);
				}
			).catch(
				function (err) {
					console.log(err);
				}
			);
		}
		/*
		*	Parameters for Problem Generation
		*	0-6 Store Parameters for Problem
		*	7 Stores The Message/Name of Problem Set
		*	8 Stores The Type of Problem (Operational,Conversion,Volume)
		*	9 Stores the StudentId/ClassId of Recipient
		*	10 Stores whether this is sent to a student or a class
		*/
		$scope.param = [0, 0, 0, 0, 0, 0, 0, "", 0, "", ""];
		$scope.examples = [
		];


		$scope.createExamples = function (params) {
			console.log(params[9]);
			$scope.examples = [];
			var paramFill = 1;
			if (params[8] != 0) {
				$scope.examples.push("Examples Unsupported For This");
				paramFill = 0;
			} else
				for (var i = 0; i < 7; i++) {
					if (params[i] == null) {
						paramFill = 0;
						var missingType;
						switch (i) {
							case 0:
								missingType = "Type of Problem";
								break;
							case 1:
								missingType = "1st Value Max Value";
								break;
							case 2:
								missingType = "1st Value Min Value";
								break;
							case 3:
								missingType = "1st Value Multiples Of";
								break;
							case 4:
								missingType = "2nd Value Max Value";
								break;
							case 5:
								missingType = "2nd Value Min Value";
								break;
							case 6:
								missingType = "2nd Value Multiples Of";
								break;
							default:
								missingType = "Unknown";
								break;
						}
						$scope.examples.push("Missing Parameter : " + missingType);
					}
				}
			if (!paramFill)
				return;
			var type, max, min, mult, max2, min2, mult2, bot, top, diff, n1, n2, answer;
			var problem = [0, 0, 0, 0];
			for (var i = 0; i < 10; i++) {
				var cProb = "";
				type = parseInt(params[0]);
				max = parseInt(params[1]);
				min = parseInt(params[2]);
				mult = parseInt(params[3]);
				max2 = parseInt(params[4]);
				min2 = parseInt(params[5]);
				mult2 = parseInt(params[6]);
				bot = min / mult;
				top = Math.floor(max / mult);
				if (bot != Math.floor(bot)) {
					bot = Math.floor(bot) + 1;
				}
				diff = top - bot + 1;
				n1 = Math.floor(Math.random() * diff) + bot;
				bot = min2 / mult2;
				top = Math.floor(max2 / mult2);
				if (bot != Math.floor(bot)) {
					bot = Math.floor(bot) + 1;
				}
				diff = top - bot + 1;
				n2 = Math.floor(Math.random() * diff) + bot;
				problem[0] = (n1) * mult;
				problem[1] = (n2) * mult2;
				cProb = cProb.concat(problem[0] + "");
				problem[2] = type;
				switch (type) {
					case 0: problem[2] = problem[0] + problem[1];
						cProb = cProb.concat("+");
						break;
					case 1:
						if (problem[0] < problem[1]) {
							var temp = problem[0];
							problem[0] = problem[1];
							problem[1] = temp;
						}
						problem[2] = problem[0] - problem[1];
						cProb = cProb.concat("-");
						break;
					case 2:
						problem[2] = problem[0] * problem[1];
						cProb = cProb.concat("*");
						break;
					case 3:
						var r = problem[0] / problem[1];
						r = Math.floor(r) + 1;
						problem[0] = r * problem[1];
						cProb = problem[0] + "/";
						problem[2] = problem[0] / problem[1];
						break;
				}
				cProb = cProb.concat(problem[1] + "=" + problem[2]);
				$scope.examples.push(cProb);
				$scope.$apply;
			}
		}

		$scope.update = function (params) {
			$scope.param = angular.copy(params);
			if ($scope.param[8] == "0") {
				$scope.probURL = "#!/MathFacts/" + $scope.param[0] + "/" +
					$scope.param[1] + "/" + $scope.param[2] + "/" + $scope.param[3] + "/" +
					$scope.param[4] + "/" + $scope.param[5] + "/" + $scope.param[6];
				var time = new Date();
				alert("Created Notification : " + $scope.probURL);
			} else if ($scope.param[8] == "1") {
				$scope.probURL = "#!/conversions/" + $scope.param[0] + "/" + $scope.param[1] + "/" + $scope.param[2];
			} else if ($scope.param[8] == "2") {
				$scope.probURL = "#!/volume/" + $scope.param[0] + "/" + $scope.param[1];
			}
			Notification.createNotification(firebase, $scope.param[9], $scope.probURL, $scope.param[10], time, time, $scope.param[7]);
		};
		firebase.auth().onAuthStateChanged(
			function (user) {
				if (user) {
					$scope.param = {};
					var uid = firebase.auth().currentUser.uid;
					var userPromise = User.readUserData(firebase, uid);
					var scopePromise = new Promise(
						function (resolve, reject) {
							resolve($scope);
						}
					);

					$scope.populateClassStats = function() {
						Class.GetStatsForClass(firebase, $scope.currClass).then(
							function (result) {
								$scope.classStats = result;
								for(var k in result) {
									$scope.classStats[k] = Math.round($scope.classStats[k] * 100);
								}
								/*$scope.classStats.Addition = Math.round($scope.classStats.Addition * 100);
								$scope.classStats.Multiplication = Math.round($scope.classStats.Multiplication * 100);
								$scope.classStats.Subtraction = Math.round($scope.classStats.Subtraction * 100);
								$scope.classStats.Volume = Math.round($scope.classStats.Volume * 100);
								$scope.classStats.Conversion = Math.round($scope.classStats.Conversion * 100);
								$scope.classStats.Division = Math.round($scope.classStats.Division * 100);*/
							});
					}

					User.readUserData(firebase, uid)
						.then((userData) => {
							if ('teacher' != userData.type) {
								window.location = "/#!/Dashboard";
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
										//console.log($scope.currClass);
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
														//				console.log(result);
													}
												);
											}
										);
									}
								}
							).then(
								$scope.populateClassStats()
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



					$scope.setType = function (params, type) {
						if (type) {
							params[10] = "student";
						} else {
							params[10] = "class";
						}
					}
					$scope.update = function (params) {
						$scope.param = angular.copy(params);
						console.log(params[10]);
						var time = new Date();
						if ($scope.param[8] == "0") {
							$scope.probURL = "#!/MathFacts/" + $scope.param[0] + "/" +
								$scope.param[1] + "/" + $scope.param[2] + "/" + $scope.param[3] + "/" +
								$scope.param[4] + "/" + $scope.param[5] + "/" + $scope.param[6];
						} else if ($scope.param[8] == "1") {
							$scope.probURL = "#!/conversions/" + $scope.param[0] + "/" + $scope.param[1] + "/" + $scope.param[2];
						} else if ($scope.param[8] == "2") {
							$scope.probURL = "#!/volume/" + $scope.param[1] + "/" + $scope.param[2];
						}
						alert("Created Notification : " + $scope.probURL);
						Notification.createNotification(firebase, $scope.params[9], $scope.probURL, $scope.params[10], time, time, $scope.param[7]);
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
						$scope.populateClassStats();
					}

					$scope.addStudent = function () {
						var code = document.getElementById('code').value;
						if (code.length <= 0) {
							alert("You must enter a code");
							return;
						}


						var classId = $scope.currClass; // TODO multiple class functionality?

						return Class.addStudentWithHash(firebase, code, classId).then(
							function () {
								alert("Student added successfully!");
								clickClass($scope.currClass);
								document.getElementById("addStudentsModal").style.display = "none";
							},
							function () {
								alert("That code is not valid");
								document.getElementById("addStudentsModal").style.display = "none";
							}
						);
					}
					$scope.createClass = function () {
						var classDesc = document.getElementById('classDesc').value;
						if (classDesc <= 0) {
							alert("You must enter a description");
							return;
						}

						return Class.createClass(firebase, firebase.auth().currentUser.uid, classDesc,
							new Date()).then(
								function () {
									alert("Created class!");
									$scope.classes = $scope.classes.concat(classDesc);
									document.getElementById("ACmodal").style.display = "none";
								}, function (err) {
									alert(err);
									document.getElementById("ACmodal").style.display = "none";
								}
							);
					}
				} else {
					firebase.auth().signOut();
					window.location = "/#!/Login";
				}
			}
		);

	}
]);

function logout() {
	firebase.auth().signOut();
	window.location = "/#!/Login";
}