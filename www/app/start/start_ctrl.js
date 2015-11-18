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
        $state.go('search');
      });
    };
  };

  angular.module('kiwii').
    controller('StartCtrl', StartCtrl);
})();
