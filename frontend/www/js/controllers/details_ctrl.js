(function() {
  var DetailsCtrl = function($scope, $state, $timeout, $ionicPopover, RestuarantPreference) {

    // TODO: Don't use hardcoded restuarant
    $scope.restuarant = {
      title: 'Le Marché St. George',
      id: '4d10e635e236548135997aea'
    };

    var restuarantPreference = null;

    $scope.toggleFavourite = function($event) {
      restuarantPreference.toggle()
          .then(function(isFavourite) {
            $scope.isFavourite = isFavourite;

            // TODO: Consider using https://github.com/rafbgarcia/angular-parse-wrapper
            $scope.$digest();
            if (isFavourite) {
              $scope.popover.show($event);
            }
          });
    };

    $scope.popover = $ionicPopover.fromTemplateUrl('templates/favourites_popup.html' , {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    // TODO: Use Parse.User.current() instead
    new Parse.Query('_User').get('0UqMUpM14U')
        .then(function(user) {
          restuarantPreference = new RestuarantPreference(user, $scope.restuarant.id);
          return restuarantPreference.isFavourite();
        })
        .then(function(isFavourite) {
          $scope.isFavourite = isFavourite;
        });
  };

  angular.module('app').
    controller('DetailsCtrl', DetailsCtrl);
})();
