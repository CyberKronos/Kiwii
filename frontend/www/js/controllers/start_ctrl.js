(function() {
  var StartCtrl = function($scope, $rootScope, $state, auth, Store, Actions, AppConstants) {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile'
      },
      standalone: true
    }, Actions.logIn, handleLoginError);

    Store.bindState($scope, function(action) {
      if (auth.isAuthenticated && action && action.actionType == AppConstants.SET_CURRENT_USER) {
        $rootScope.currentUser = Store.getCurrentUser();
        $state.go('dash');
      }
    });

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
      Actions.facebookLogin();
    };
  };

  angular.module('app').
    controller('StartCtrl', StartCtrl);
})();
