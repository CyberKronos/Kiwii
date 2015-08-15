(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', '$state', '$timeout', '$ionicScrollDelegate', 'LocationService', 'RestaurantExplorer', 'RestaurantDetails', 'AnalyticsTracking', 'CRITERIA_OPTIONS',
      function ($scope, $state, $timeout, $ionicScrollDelegate, LocationService, RestaurantExplorer, RestaurantDetails, AnalyticsTracking, CRITERIA_OPTIONS) {

        findRestaurantsNearby();
        findRestaurantsSavedForLater();
        applyHorizontalScrollFix('nearby-restaurants-scroll');
        applyHorizontalScrollFix('saved-restaurants-scroll');

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
              var nearbyCriteria = {
                ll: latLng.lat + ',' + latLng.lng,
                radius: 2000,
                query: CRITERIA_OPTIONS.CUISINE_TYPES[0]['name'],
                limit: 10
              };
              return RestaurantExplorer.findWithKiwii(nearbyCriteria);
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


        /**
         * Allows Horizontal Scroll Content area to be used to vertically scroll its parent's container.
         * Needs to be used with horizontalScrollFix directive.
         * Adapted from http://codepen.io/rajeshwarpatlolla/pen/xGWBja?editors=101
         * Waiting for official fix in Ionic 1.1
         * @param ionScrollHandle delegate handle of the ion-scroll content
         */
        function applyHorizontalScrollFix(ionScrollHandle) {
          $timeout(function(){
            //return false; // <--- comment this to "fix" the problem
            var sv = $ionicScrollDelegate.$getByHandle(ionScrollHandle).getScrollView();

            var container = sv.__container;

            var originaltouchStart = sv.touchStart;
            var originalmouseDown = sv.mouseDown;
            var originaltouchMove = sv.touchMove;
            var originalmouseMove = sv.mouseMove;

            container.removeEventListener('touchstart', sv.touchStart);
            container.removeEventListener('mousedown', sv.mouseDown);
            document.removeEventListener('touchmove', sv.touchMove);
            document.removeEventListener('mousemove', sv.mousemove);


            sv.touchStart = function(e) {
              e.preventDefault = function(){};
              originaltouchStart.apply(sv, [e]);
            };

            sv.touchMove = function(e) {
              e.preventDefault = function(){};
              originaltouchMove.apply(sv, [e]);
            };

            sv.mouseDown = function(e) {
              e.preventDefault = function(){};
              originalmouseDown.apply(sv, [e]);
            };

            sv.mouseMove = function(e) {
              e.preventDefault = function(){};
              originalmouseMove.apply(sv, [e]);
            };

            container.addEventListener("touchstart", sv.touchStart, false);
            container.addEventListener("mousedown", sv.mouseDown, false);
            document.addEventListener("touchmove", sv.touchMove, false);
            document.addEventListener("mousemove", sv.mouseMove, false);
          });
        }
      }]);
})();