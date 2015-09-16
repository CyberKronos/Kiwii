(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', '$rootScope', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$q', '$templateCache',
      'Cards', 'LocationService', 'RestaurantExplorer', 'RestaurantDetails', 'ViewedHistory', 'CRITERIA_OPTIONS',
      function ($scope, $rootScope, $timeout, $ionicScrollDelegate, $ionicPopup, $q, $templateCache,
                Cards, LocationService, RestaurantExplorer, RestaurantDetails, ViewedHistory, CRITERIA_OPTIONS) {

        $scope.findRestaurantsNearby = findRestaurantsNearby;
        //$scope.getSavedForLater = getSavedForLater;
        $scope.getRecentlyViewedRestaurants = getRecentlyViewedRestaurants;
        $scope.getUserCards = Cards.getUserCards.bind(null, Parse.User.current().id);

        $scope.$on('$ionicView.beforeEnter', function() {        
          $scope.$broadcast('scrollList.refresh');

          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });

        $scope.doRefresh = function () {
          $scope.$broadcast('scrollList.refresh');

          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        };

        console.log($templateCache.info());

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
            .catch(showLocationError);
        }

        function getRecentlyViewedRestaurants() {
          return ViewedHistory.retrieveRecentRestaurants(Parse.User.current().id);
        }

        function showLocationError(positionError) {
          var isAndroid = ionic.Platform.isAndroid();
          var confirmPopup = $ionicPopup.confirm({
            title: 'Current Location Unavailable',
            template: positionError.label,
            buttons: [
              {
                text: 'Cancel'
              },
              {
                text: 'Ok',
                type: 'button-assertive',
                onTap: function () {
                  confirmPopup.close();
                  if (isAndroid) {
                    cordova.plugins.diagnostic.switchToLocationSettings();
                    setTimeout(function () {
                      fetchCurrentLocation().then(function () {
                        $scope.isLoadingLocation = false;
                      });
                    }, 8000);
                  }
                }
              }
            ]
          });
          return $q.reject(positionError);
        }
      }]);
})();
