(function() {
  var StartCtrl = function($scope, $state, $ionicHistory, Actions) {
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
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('search');
      });
    };
  };

  angular.module('kiwii').
    controller('StartCtrl', StartCtrl);
})();
