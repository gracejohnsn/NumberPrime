'use strict';

angular.module('math', ['ngRoute']);
angular.
  module('math').
  component('math', {
    templateUrl: 'mathView/mathView.template.html',
    controller: ["$scope", "$routeParams",
      function MathController($scope, $routeParams) {
      $scope.first = $routeParams.nDig;
	}
    ]
  });


