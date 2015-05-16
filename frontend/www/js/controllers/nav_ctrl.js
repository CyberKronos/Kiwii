(function() {
  var NavCtrl = function($scope, $state, $window, $timeout, Store, Actions, AppConstants, $ionicModal, $ionicSideMenuDelegate, $ionicPopover, $ionicHistory) {

    $scope.goBack = function() {
      var stateId = $ionicHistory.currentView().stateId; 
      // Go back to start if on login or register view
      if ((stateId == 'login') || (stateId == 'register')) {
        $state.go('start');
      }
      // If view is in card list, set back to dash view
      if (stateId == 'cards' || stateId == 'profile') { 
        if ($ionicHistory.backView().stateId == 'details') {
          $state.go('details');
        } else {
          $state.go('dash');
        }
      }
      // If view is in map, go back to details
      if (stateId == 'maps') {
        $state.go('details');
      }
      // If view is in any of the tabbed pages, set back to card list
      if ((stateId == 'details') || (stateId == 'instagram') || (stateId == 'reviews')) {
        if ($ionicHistory.backView().stateId == 'profile') {
          $state.go('profile');
        } else {
          $state.go('cards');
        }
      }
    };

    $scope.logOut = function() {
      Actions.logOut();
      $timeout(function() { $window.location.reload(true) }, 500);
      if ($scope.moreOptionsPopoverIsOpen) {
        $scope.closePopover();
      }
    }

    $scope.resetPreferences = function() {
      Actions.resetPreferences();
      Actions.fetchShows();
      if ($scope.moreOptionsPopoverIsOpen) {
        $scope.closePopover();
      }
    }

    /* Side Menu Delegate Setup */
    $ionicSideMenuDelegate.edgeDragThreshold(25);

    $scope.sideMenuIsOpen = function() {
      return $ionicSideMenuDelegate.isOpenLeft();
    }

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

    $scope.openLikedShowsModal = function() {
      Actions.fetchLikedShows();
      $scope.likedShowsModal.show();
      $scope.likedShowsModalIsOpen = true;
    };

    $scope.closeModal = function() {
      $scope.likedShowsModal.hide();
      $scope.likedShowsModalIsOpen = false;
    };

    $scope.$on('$destroy', function() {
      $scope.likedShowsModal.remove();
      $scope.likedShowsModalIsOpen = false;
    });

    $scope.$on('modal.hidden', function() {
      $scope.likedShowsModalIsOpen = false;
    });

    $scope.$on('modal.removed', function() {
      $scope.likedShowsModalIsOpen = false;
    });

    /* More options popover */
    $ionicPopover.fromTemplateUrl('templates/more_options_menu.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
      $scope.moreOptionsPopoverIsOpen = true;
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
      $scope.moreOptionsPopoverIsOpen = false;
    };

    $scope.$on('$destroy', function() {
      $scope.popover.remove();
      $scope.moreOptionsPopoverIsOpen = false;
    });

    $scope.$on('popover.hidden', function() {
      $scope.moreOptionsPopoverIsOpen = false;
    });

    $scope.$on('popover.removed', function() {
      $scope.moreOptionsPopoverIsOpen = false;
    });
  }

  angular.module('app').
    controller('NavCtrl', NavCtrl);
})();
