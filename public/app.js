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
  'conversions',
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
	   when('/MathFacts/:type/:max1/:min1/:mult1/:max2/:min2/:mult2', {
          template: '<math></math>'
        }).

    when('/Settings', {
        template: '<settings></settings>'
      }).
    when('/Measurement', {
      template: '<measurement></measurement>'
    }).

    when('/volume/:max/:min', {
      template: '<volume></volume>'
    }).

    when('/conversions/:type/:max/:min', {
      template: '<conversions></conversions>'
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
