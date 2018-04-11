'use strict';
angular.module('myApp', [
  'ngRoute',
  'studentdash',
  'math',
  'teacherdash',
  'login',
  'settings',
  'measurement',
  'volume',
  'view2',

]);

angular.
  module('myApp').
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
      $routeProvider.
        when('/Dashboard', {
          template: '<studentdash></studentdash>'
        }).
	   when('/DashboardTeach', {
          template: '<teacherdash></teacherdash>'
        }).
	   when('/MathFacts', {
          template: '<math></math>'
        }).

    when('/Settings', {
        template: '<settings></settings>'
      }).
    when('/Measurement', {
      template: '<measurement></measurement>'
    }).

    when('/volume', {
      template: '<volume></volume>'
    }).

	   when('/Login', {
          template: '<login></login>'
        }).
 	   when('/view2', {
          template: '<view2></view2>'
        }).
     otherwise('/Dashboard');
    }
  ]);
