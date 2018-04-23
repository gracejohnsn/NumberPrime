'use strict';

  var meas = angular.module('measurement', ['ngRoute']);
  meas.
    component('measurement', {
      templateUrl: 'MeasurementView/measurement.html',
          controller: 'measurementCtrl'
    });
  
  meas.controller('measurementCtrl',["$scope", 
    function($scope) {

    }]);