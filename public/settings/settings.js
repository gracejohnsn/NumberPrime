'use strict';


var app = angular.module('settings', ['ngRoute']);
  angular.module('settings').
  component('settings', {
    templateUrl: 'settings/settings.html',
  });

app.controller('settings', function($scope) {
  var uid = firebase.auth().currentUser.uid;
  var userPromise = User.readUserData(firebase, uid);
  var scopePromise = new Promise(
    function(resolve, reject) {
      resolve($scope);
    }
  );
  Promise.all([userPromise, scopePromise]).then(
    function(results) {
      var user = results[0];
      $scope = results[1];
      $scope.name = user.firstName + " " + user.surName;
      $scope.email = user.email;
      $scope.role= user.type;
      $scope.var = "false";
      $scope.editProfile = function() {
        $scope.var = true;
      }
      $scope.saveChanges = function(name, email) {
        $scope.var = false;
        name = name.trim();
        $scope.name = name;
        $scope.email = email;
        var firstName = name.substr(0, name.indexOf(" "));
        var lastName = name.substr(name.lastIndexOf(" ") + 1, );
        //console.log("Hey! Settings is working");
        User.writeUserData(firebase, firebase.auth().currentUser.uid, firstName, 
          lastName, email, "justUpdating", null, null); // TODO this needs to be edited
      }
      $scope.cancel = function() {
        $scope.var = false;
      }
      $scope.$apply();
    },
    function(err) {
      alert(err);
    }  
  );
  
});
