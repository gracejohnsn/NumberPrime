'use strict';

var loggingIn = false;

var loginDash = angular.module('login', ['ngRoute']);
loginDash.
  component('login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });

loginDash.controller('LoginController', ["$scope", function ($scope) {
  var display = sessionStorage['load'] || 'none';
  $("#greyout").css('display', display);
  firebase.auth().onAuthStateChanged(
    function (user) {
      if (user) {
        var uid = user.uid;
        User.readUserData(firebase, uid).then(
          function (result) {
            if ('student' == result.type) {
              //document.getElementById("greyout").style.display = "none";
              sessionStorage['load'] = 'none';
              window.location = "/#!/Dashboard";
            } else {
              //document.getElementById("greyout").style.display = "none";
              sessionStorage['load'] = 'none';
              window.location = "/#!/DashboardTeach";
            }
          }
        ).catch(
          function (err) {
            alert(err);
            window.location = "/#!/view2";
          }
        );
      }
    }
  );
}])

/*$(document).ready(
  
);*/

function clicklogin() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
    firebase.auth().signInWithRedirect(provider)).then(
      firebase.auth().getRedirectResult()).then(
        function () {
          sessionStorage['load'] = 'block';
        }
      );
}