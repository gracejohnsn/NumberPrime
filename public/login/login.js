'use strict';

angular.module('login', ['ngRoute']);
angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.html',
    controller: ['LoginController',
      function LoginController() {
        
      }
    ]
  });

  $(document).ready(
    function() {
      firebase.auth().onAuthStateChanged(
        function(user) {
          if(user) {
            var uid = user.uid;
            User.readUserData(firebase, uid).then(
              function(result) {
                if('student' == result.type) {
                  window.location = "/#!/Dashboard";
                } else {
                  window.location = "/#!/DashboardTeach";
                }
              }
            ).catch(
              function(err) {
                window.location = "/#!/view2";
              }
            );
          }
        }
      );
    }
  );

function login() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
  firebase.auth().signInWithRedirect(provider)).then(
  firebase.auth().getRedirectResult());
}