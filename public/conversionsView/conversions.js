'use strict';

var conversions = angular.module('conversions', ['ngRoute']);
conversions.
  component('conversions', {
    templateUrl: 'conversionsView/conversions.html',
    controller: 'conversionsController'
  });

  conversions.controller('conversionsController',["$scope", "$routeParams",
      function($scope, $routeParams) {
        var uid = firebase.auth().currentUser.uid;
        $scope.totalRight = 0;
        $scope.probURL = "#!/conversions/";
      $scope.conversionParams = 
        parseInt($routeParams.type) + "," +
        parseInt($routeParams.max) + "," +
        parseInt($routeParams.min);
        $scope.writeConversionSet = function(correct,questions,answers) {
          var time = new Date();
          var pQuestions = [];
          var pAnswers = [];
          console.log(questions);
          for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            pQuestions.push(q.randomNumber + q.fromUnit + "->" + q.toUnit);
            if (q.answer == undefined) {
              q.answer = 0;
            }
            pAnswers.push(q.answer);
          }
          ProblemInstance.createProblemInstance(firebase, uid, "Conversion", correct, questions.length, pQuestions, answers, pAnswers,  time, $scope.probURL);
        }
      $scope.$apply;
      }]);
