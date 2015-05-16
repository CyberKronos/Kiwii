(function() {
  var NavCtrl = function($scope, $state, $window, $timeout, Store, Actions, AppConstants, $ionicModal, $ionicSideMenuDelegate, $ionicPopover, $ionicHistory) {

    $scope.favouritesList = [
      {title: 'Vij\'s', rating: 8, category: 'Indian', image: 'https://irs0.4sqi.net/img/general/width960/rSyrlfuOIneyVMzihStGP5iYGBAcDv8sqc5vpa2qPsA.jpg'},
      {title: 'Chambar', rating: 9.5, category: 'Restaurant', image: 'https://irs0.4sqi.net/img/general/width960/34995420_-w6_v1KWUtilq5Tem-VHV-M3-PXnFxFz2GooQA5g0UU.jpg'},
      {title: 'Faubourg Bistro', rating: 7.8, category: 'Cafe', image: 'https://irs0.4sqi.net/img/general/width960/C83zIrAX6Obwo7WN6CznE0CXkLfAFk9FhoRkq3V7OZw.jpg'},
      {title: 'Le Marché St. George', rating: 9.8, category: 'Cafe', image: 'https://irs2.4sqi.net/img/general/width960/8vim2slvDNthYIZYfeRXLVK7Ka0elGHBblDKAwpdn6c.jpg'}
    ];

    $scope.goBack = function() {
      var stateId = $ionicHistory.currentView().stateId;
      // Go back to start if on login or register view
      if ((stateId == 'login') || (stateId == 'register')) {
        $state.go('start');
      }
      // If view is in card list then remove history and set back to dash view
      if (stateId == 'cards' || stateId == 'profile') { 
        $state.go('dash');
      }
      // // If view is in map, go back to details
      // if (stateId == 'tab.map') {
      //   $state.go('tab.details', {});
      // }
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
    };

    $scope.removeRestaurant = function(index) {
      $scope.favouritesList.splice(index, 1);
    };
  };

  angular.module('app').
    controller('NavCtrl', NavCtrl);
})();
