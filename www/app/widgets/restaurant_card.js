(function () {
  var restaurantCard = function (BrowserService) {

    var controller = ['$scope', '$state',
      function ($scope, $state) {
        $scope.openWebsite = BrowserService.open;
        $scope.goToMaps = function (id) {
          $state.go('maps', {venueId: id});
        };

        $scope.goToPhotos = function (id) {
          $state.go('photos', {venueId: id});
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
        restaurant: '=',
        currentLocation: '='
      },
      controller: controller
    }
  };

  angular.module('kiwii').
    directive('restaurantCard', restaurantCard);
})();
