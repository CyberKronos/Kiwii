(function() {
  var StartCtrl = function($scope, $ionicDeploy, $state, Actions) {
    // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function() {
        $ionicDeploy.update().then(function(res) {
            console.log('Ionic Deploy: Update Success! ', res);
        }, function(err) {
            console.log('Ionic Deploy: Update error! ', err);
        }, function(prog) {
            console.log('Ionic Deploy: Progress... ', prog);
        });
    };

    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
        console.log('Ionic Deploy: Checking for updates');
        $ionicDeploy.check().then(function(hasUpdate) {
            console.log('Ionic Deploy: Update available: ' + hasUpdate);
            $scope.hasUpdate = hasUpdate;
        }, function(err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
        });
    };

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
