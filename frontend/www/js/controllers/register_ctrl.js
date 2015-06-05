(function() {
  var RegisterCtrl = function($scope, $state, $localStorage, $ionicPopup, Actions) {
    $scope.registerObj = {};
    $scope.emailRegister = function() {
        Actions.register($scope.registerObj.username, $scope.registerObj.firstname, $scope.registerObj.lastname, $scope.registerObj.email, $scope.registerObj.password)
        .then(
          function() {
            $state.go('intro');
          }, function(error) {
            var alertPopup = $ionicPopup.alert({
              title: 'Registration Error',
              template: error,
              buttons: [
                { 
                  text: 'Ok',
                  type: 'button-assertive',
                }
              ]
            });
          }
        );
    };
  }

  angular.module('kiwii')
    .controller('RegisterCtrl', RegisterCtrl)
})();
