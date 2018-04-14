'use strict';

var math = angular.module('math', ['ngRoute']);
math.
  component('math', {
    templateUrl: 'mathView/mathView.template.html',
    controller: 'mathCtrl'
  });

math.controller('mathCtrl',["$scope", "$routeParams",
      function($scope, $routeParams) {
	var sP = $scope.params;
      $scope.first = $routeParams.nDigs;
	 sP = "";
	 sP = sP.concat($routeParams.nDigs+",");
	sP = sP.concat($routeParams.type+",");
	sP = sP.concat($routeParams.max+",");
	sP = sP.concat($routeParams.min+",");
	sP = sP.concat($routeParams.mult);
	$scope.params = sP;
	 	
	}]);