'use strict';

angular.module('view2', ['ngRoute']);
angular.
  module('view2').
  component('view2', {
    templateUrl: 'view2/view2.html',
    controller: ['vi',
      function viController() {
      
	}
    ]
  });

  function createAccount() {
    if(document.getElementById('teacherCheck').checked) {
      // create teacher
      var user = firebase.auth().currentUser;
      var name = user.displayName.trim();
      var firstName = name.substr(0, name.indexOf(" "));
      var surName = name.substr(name.lastIndexOf(" ") + 1, );
      var email = document.getElementById('emailEntry').value;
      email = email == "" ? user.email : email;
      User.createUser(firebase, user.uid, firstName, surName, email, new Date(), 
        "teacher", {"classList": [], "teacherDesc": ""}).then(
          function() {
            window.location = "/#!/DashboardTeach";
          }, function(err) {
            alert("There was an error, please try again.");
          }
        );
    } else {
      var user = firebase.auth().currentUser;
      var name = user.displayName.trim();
      var firstName = name.substr(0, name.indexOf(" "));
      var surName = name.substr(name.lastIndexOf(" ") + 1, );
      var email = user.email;
      var gradeLevel = document.querySelector('input[name = "grade"]:checked').value;
      User.createUser(firebase, user.uid, firstName, surName, email, new Date(),
        "student", {"classId": -1, "gradeLevel": gradeLevel}).then(
          function() {
            window.location = "/#!/Dashboard";
          }, function(err) {
            alert("There was an error, please try again.")
          }
        );
    }
  }
