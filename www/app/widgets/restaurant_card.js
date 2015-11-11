(function () {
  var restaurantCard = function (BrowserService, SavedForLater) {

    var controller = ['$scope', '$state',
      function ($scope, $state) {
        $scope.restaurant = $scope.card.taggedRestaurant;
        $scope.isSaved = false;
        SavedForLater.get()
          .then(_.method('containsCard', $scope.card))
          .then(function (result) {
            $scope.isSaved = result;
          });

        $scope.openWebsite = BrowserService.open;
        $scope.goToMaps = function (id) {
          $state.go('maps', {venueId: id});
        };
        $scope.goToPhotos = function (id) {
          $state.go('photos', {venueId: id});
        };
        $scope.toggleSave = function (card) {
          var currentState = $scope.isSaved;
          var toggle = !$scope.isSaved ? 'addCard' : 'removeCard';
          SavedForLater.get()
            .then(_.method(toggle, card))
            .then(function () {
              $scope.isSaved = !currentState;
            })
            .catch(function (error) {
              $scope.isSaved = currentState;
              console.log(error);
            })
        };

        $scope.distanceBetweenRestaurant = function () {
          var currentLocation = $scope.currentLocation;
          if (_.isString($scope.currentLocation)) {
            currentLocation = $scope.currentLocation.split(',');
          }
          currentLocation = new Parse.GeoPoint(currentLocation);
          var restaurantLocation = new Parse.GeoPoint($scope.restaurant.location.lat, $scope.restaurant.location.lng);
          return currentLocation.kilometersTo(restaurantLocation).toFixed(1);
        };
      }];

    return {
      restrict: 'E',
      templateUrl: 'app/widgets/restaurant_card.html',
      replace: true,
      scope: {
        card: '=',
        currentLocation: '='
      },
      controller: controller
    }
  };

  angular.module('kiwii').
    directive('restaurantCard', restaurantCard);
})();
