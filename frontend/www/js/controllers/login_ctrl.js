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
        var appId = 1594340540779035;
        facebookConnectPlugin.browserInit(appId);
      }
      Actions.facebookLogin()
      .then(function() {
        $state.go('dash');
      });
    };
  }

  angular.module('kiwii')
    .controller('LoginCtrl', LoginCtrl)
})();
