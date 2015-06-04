(function() {
  var NavCtrl = function($scope, $state, $window, $timeout, Store, Actions, AppConstants, $ionicModal, $ionicSideMenuDelegate, $ionicPopover, $ionicHistory) {

    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    $scope.logOut = function() {
      Actions.logout()
      .then(function() {
        $state.go('start');
      });
    };

    $scope.resetPreferences = function() {
      Actions.resetPreferences();
      Actions.fetchShows();
      if ($scope.moreOptionsPopoverIsOpen) {
        $scope.closePopover();
      }
    };

    /* Side Menu Delegate Setup */
    $ionicSideMenuDelegate.edgeDragThreshold(25);

    $scope.sideMenuIsOpen = function() {
      return $ionicSideMenuDelegate.isOpenLeft();
    };

    $scope.$watch($scope.sideMenuIsOpen, function(isOpen) {
      if (isOpen) {
        $scope.sideMenuWasOpen = true;
      } else {
        if ($scope.sideMenuWasOpen) {
          Actions.fetchShows();
          $scope.sideMenuWasOpen = true;
        }
      }
    });

    /* Liked Shows Modal */
    $ionicModal.fromTemplateUrl('templates/liked.html', {
      scope: $scope,
      animation: 'fade-in',
      hideDelay: 0
    }).then(function(modal) {
      $scope.likedShowsModal = modal;
    });
  };

  angular.module('kiwii').
    controller('NavCtrl', NavCtrl);
})();