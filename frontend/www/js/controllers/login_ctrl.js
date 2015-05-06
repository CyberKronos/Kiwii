(function() {
  var LoginCtrl = function($scope, $q, $rootScope, $state, Actions) {
    $scope.loginObj = {};
    $scope.emailLogin = function() {
        Actions.login($scope.loginObj.username, $scope.loginObj.password)
        .then(function() {
            $state.go('dash');
        });
    };

    $scope.facebookLogin = function() {
      if (!window.cordova) {
        var appId = 1594340540779035;
        facebookConnectPlugin.browserInit(appId);
      }
      Actions.facebookLogin();
    };
  }

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl)
})();
