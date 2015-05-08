(function() {
  var DetailsCtrl = function($scope, $state, $timeout, $ionicPopover) {

    $scope.toggleFavourite = function($event) {
      // TODO: Update server
      $scope.isFavourite = !$scope.isFavourite;
      if ($scope.isFavourite) {
        //$scope.showFavouritesPopup(); // Alternate way of showing saved popup
        $scope.popover.show($event);
      }
    };

    $scope.restuarant = {
      title: 'Le Marché St. George'
    };

    //$scope.showFavouritesPopup = function() {
    //  var favouritesPopup = $ionicPopup.show({
    //    title: 'Added <b>Le Marché St. George</b> to your \'Saved for later\' list.',
    //    scope: $scope,
    //    buttons: [
    //      {text : 'Check out your list',
    //       onTap : function(e) {
    //        console.log(e);
    //         $state.go('profile');
    //       }}
    //    ]
    //  });
    //  $timeout(function() {
    //    favouritesPopup.close();
    //  }, 3000);
    //};

    $scope.popover = $ionicPopover.fromTemplateUrl('templates/favourites_popup.html' , {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

//Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    $scope.isFavourite = false;
  };

  angular.module('app').
    controller('DetailsCtrl', DetailsCtrl);
})();
