(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', 'LocationService', 'RestaurantExplorer', 'CRITERIA_OPTIONS',
      function ($scope, LocationService, RestaurantExplorer, CRITERIA_OPTIONS) {

        findRestaurantsNearby();
        findRestaurantsSavedForLater();

        function findRestaurantsNearby() {
          LocationService.fetchCurrentLocation()
            .then(function (latLng) {
              return RestaurantExplorer.fetch({
                ll: latLng.lat + ',' + latLng.lng,
                radius: 2000,
                query: CRITERIA_OPTIONS.CUISINE_TYPES[0]['name']
              });
            })
            .then(function (results) {
              $scope.restaurantsNearby = results;
            })
        }

        function findRestaurantsSavedForLater() {

        }

        $scope.myList = [
          {
            imageUrl: 'http://placehold.it/100x100?text=Kiwii',
            name: 'A Place',
            category: 'Italian'
          },
          {
            imageUrl: 'http://placehold.it/100x100?text=Kiwii',
            name: 'Bistro',
            category: 'French'
          },
          {
            imageUrl: 'http://placehold.it/100x100?text=Kiwii',
            name: 'The Dragon',
            category: 'Chinese'
          },
          {
            imageUrl: 'http://placehold.it/100x100?text=Kiwii',
            name: 'Crawford',
            category: 'British'
          },
          {
            imageUrl: 'http://placehold.it/100x100?text=Kiwii',
            name: 'Sofkra',
            category: 'Indian'
          },
          {
            imageUrl: 'http://placehold.it/100x100?text=Kiwii',
            name: 'Hajime',
            category: 'Japanese'
          },
          {
            imageUrl: 'http://placehold.it/100x100?text=Kiwii',
            name: 'Sodium Laureth Sulfate',
            category: 'Modern'
          }
        ]
      }]);
})();