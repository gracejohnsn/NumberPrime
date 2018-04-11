'use strict';


var app = angular.module('settings', ['ngRoute']);
  angular.module('settings').
  component('settings', {
    templateUrl: 'settings/settings.html',
  });

app.controller('settings', function($scope) {
  $scope.name = "John Doe";
  $scope.email = "johndoe@gmail.com";
  $scope.role= "Teacher";
  $scope.var = "false";
  $scope.editProfile = function() {
    $scope.var = true;
  }
  $scope.saveChanges = function(name, email) {
    $scope.var = false;
    $scope.name = name;
    $scope.email = email;
  }
  $scope.cancel = function() {
    $scope.var = false;
  }
});
