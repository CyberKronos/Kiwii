(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', '$timeout', '$ionicScrollDelegate', '$q', '$templateCache',
      'Cards', 'LocationService', 'RestaurantExplorer', 'ViewedHistory', 'CRITERIA_OPTIONS', 'BrowserService',
      function ($scope, $timeout, $ionicScrollDelegate, $q, $templateCache,
                Cards, LocationService, RestaurantExplorer, ViewedHistory, CRITERIA_OPTIONS, BrowserService) {
        loadContent();

        function loadContent() {
          $scope.findRestaurantsNearby = findRestaurantsNearby;
          $scope.getRecentlyViewedRestaurants = getRecentlyViewedRestaurants;
          $scope.getUserCards = getUserCards;
        }

        function getUserCards() {
          return Cards.getUserCards(Parse.User.current().id);
        }

        function findRestaurantsNearby() {
          return LocationService.fetchCurrentLocation()
            .then(function (latLng) {
              var nearbyCriteria = {
                ll: latLng.lat + ',' + latLng.lng,
                radius: 2000,
                query: CRITERIA_OPTIONS.CUISINE_TYPES[0]['name'],
                limit: 10
              };
              return RestaurantExplorer.findWithKiwii(nearbyCriteria);
            })
            .catch(LocationService.showLocationError);
        }

        function getRecentlyViewedRestaurants() {
          return ViewedHistory.retrieveRecentRestaurants(Parse.User.current().id);
        }

        $scope.openWebsite = BrowserService.open;

        $scope.doRefresh = function () {
          $scope.$broadcast('scrollList.refresh');
          loadContent();
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        };
      }]);
})();
