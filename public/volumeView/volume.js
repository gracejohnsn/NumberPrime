/*'use strict';

var app = angular.module('volume', ['ngRoute']);
angular.
  module('volume').
  component('volume', {
    templateUrl: 'volumeView/volume.html',
  });

app.controller('volume', function($scope) {

});
*/
'use strict';

var volume = angular.module('volume', ['ngRoute']);
volume.
  component('volume', {
    templateUrl: 'volumeView/volume.html',
  });

  volume.controller('volumeController',["$scope", "$routeParams",
      function($scope, $routeParams) {

        $scope.correct = 0;
        $scope.report = "false";
        $scope.showReport = function(correct) {
          $scope.correct = correct;
          $scope.report = "true";
        }

        var uid = firebase.auth().currentUser.uid;
        $scope.probURL = "#!/volume/";
        $scope.volumeParams =
        parseInt($routeParams.max) + "," +
        parseInt($routeParams.min);
        $scope.writeVolumeSet = function(nCorrect,sAnswers,pQuestions,pAnswers) {
          var time = new Date();
          ProblemInstance.createProblemInstance(firebase, uid, "Volume", nCorrect, pQuestions.length, pQuestions, sAnswers, pAnswers,  time, $scope.probURL);
          Notification.setCompleteProblem(firebase,currPsId,uid,time);
        }
      $scope.$apply;
      }]);
