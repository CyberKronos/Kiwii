(function() {
  var StartCtrl = function($scope, $rootScope, $state, Store, Actions, AppConstants) {
    function handleLoginError() {
      // Do something
    }

    $scope.goLogin = function() {
      $state.go('login');
    };

    $scope.goRegister = function() {
      $state.go('register');
    };

    $scope.facebookLogin = function() {
      if (!window.cordova) {
        var appId = 1594340540779035;
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
  };

  angular.module('kiwii').
    controller('StartCtrl', StartCtrl);
})();
