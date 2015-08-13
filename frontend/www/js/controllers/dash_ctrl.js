(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', '$state', 'LocationService', 'RestaurantExplorer', 'RestaurantDetails', 'AnalyticsTracking', 'CRITERIA_OPTIONS',
      function ($scope, $state, LocationService, RestaurantExplorer, RestaurantDetails, AnalyticsTracking, CRITERIA_OPTIONS) {

        findRestaurantsNearby();
        findRestaurantsSavedForLater();

        $scope.restaurantDetails = function (restaurant) {
          // TODO: Pass venue ID through state parameters instead
          RestaurantDetails.setVenueId(restaurant.foursquareId);
          AnalyticsTracking.explorerSelectedVenue(restaurant.foursquareId);
          $state.go('tab.details');
        };

        $scope.goToSearch = function () {
          $state.go('tab.search');
        };

        function findRestaurantsNearby() {
          LocationService.fetchCurrentLocation()
            .then(function (latLng) {
              return RestaurantExplorer.fetch({
                ll: latLng.lat + ',' + latLng.lng,
                radius: 2000,
                query: CRITERIA_OPTIONS.CUISINE_TYPES[0]['name'],
                limit: 10
              });
            })
            .then(function (results) {
              $scope.nearbyRestaurants = results;
            })
        }

        function findRestaurantsSavedForLater() {
          getSavedForLater()
            .then(function (results) {
              $scope.savedRestaurants = results;
            })
        }

        function getSavedForLater() {
          return Parse.User.current()
            .relation('savedRestaurants')
            .query().collection().fetch()
            .then(function (restaurantCollection) {
              return restaurantCollection.toJSON();
            });
        }
      }]);
})();