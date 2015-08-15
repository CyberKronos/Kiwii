(function () {
  var restaurantCard = function () {

    var controller = ['$scope', '$cordovaInAppBrowser',
      function ($scope, $cordovaInAppBrowser) {
        $scope.distanceBetweenRestaurant = function () {
          if (_.isString($scope.currentLocation)) {
            $scope.currentLocation = $scope.currentLocation.split(',');
          }
          var currentLocation = new Parse.GeoPoint($scope.currentLocation);
          var restaurantLocation = new Parse.GeoPoint($scope.restaurant.location.lat, $scope.restaurant.location.lng);
          return currentLocation.kilometersTo(restaurantLocation).toFixed(1);
        };
        
        $scope.openWebsite = function (link) {
          console.log(link);
          var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
          };
          $cordovaInAppBrowser.open(link, '_blank', options);
        };
      }];


    return {
      restrict: 'E',
      templateUrl: 'templates/restaurant_card.html',
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
