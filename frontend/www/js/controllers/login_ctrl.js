(function() {
  var LoginCtrl = function($scope, $q, $rootScope, $state, $ionicPopup, Actions) {
    $scope.loginObj = {};
    $scope.emailLogin = function() {
      Actions.login($scope.loginObj.username, $scope.loginObj.password)
      .then(
        function() {
          $state.go('dash');
        }, function(error) {
          var alertPopup = $ionicPopup.alert({
            title: 'Login Error',
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

    $scope.facebookLogin = function() {
      if (!window.cordova) {
        var appId = 1597756577154303;
        facebookConnectPlugin.browserInit(appId);
      }
      Actions.facebookLogin()
      .then(function(response) {
        console.log(response);
        if (response == 'existing user') {
          $state.go('dash');
        } else {
          $state.go('intro');
        }
      });
    };
  }

  angular.module('kiwii')
    .controller('LoginCtrl', LoginCtrl)
})();
