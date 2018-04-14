'use strict';

var math = angular.module('math', ['ngRoute']);
math.
  component('math', {
    templateUrl: 'mathView/mathView.template.html',
    controller: 'mathCtrl'
  });

math.controller('mathCtrl',["$scope", "$routeParams",
      function($scope, $routeParams) {
      $scope.first = $routeParams.nDigs;
	console.log($routeParams);
	}]);