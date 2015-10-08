(function () {
  var restaurantCard = function () {

    var controller = ['$scope',
      function ($scope) {
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
        currentLocation: '=',
        openWebsite: '=',
        goToMaps: '='
      },
      controller: controller
    }
  };

  angular.module('kiwii').
    directive('restaurantCard', restaurantCard);
})();
