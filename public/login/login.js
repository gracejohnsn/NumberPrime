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
      firebase.auth().getRedirectResult().then(
        function(result) {
          if(result.user) {
            window.location = "/#!/Dashboard";
          }
        }
      )
    }
  );

function login() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
  firebase.auth().signInWithRedirect(provider));
}