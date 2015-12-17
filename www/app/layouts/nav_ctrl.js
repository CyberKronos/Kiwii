(function () {
  var NavCtrl = function ($scope, $state, $window, $timeout, Actions, $ionicModal, $ionicSideMenuDelegate, $ionicPopover, $ionicHistory) {

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.logOut = function () {
      Actions.logout()
        .then(function () {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('start');
        });
    };
  };

  angular.module('kiwii').
    controller('NavCtrl', NavCtrl);
})();
