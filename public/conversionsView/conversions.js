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
        $scope.writeConversionSet = function(correct,length) {
          var time = new Date();
          console.log(correct + " " + length);
          ProblemInstance.createProblemInstance(firebase, uid, "Conversion", correct, length,  time, $scope.probURL);
        }
      $scope.$apply;
      }]);
