(function() {
  var StartCtrl = function($scope, $state, Actions) {
    $scope.goLogin = function() {
      $state.go('login');
    };

    $scope.goRegister = function() {
      $state.go('register');
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
          $state.go('tab.dash');
        } else {
          $state.go('handle');
        }
      });
    };
  };

  angular.module('kiwii').
    controller('StartCtrl', StartCtrl);
})();
