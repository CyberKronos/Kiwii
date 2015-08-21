(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', '$rootScope', '$timeout', '$ionicScrollDelegate', 'LocationService', 'RestaurantExplorer', 'RestaurantDetails', 'AnalyticsTracking', 'CRITERIA_OPTIONS',
      function ($scope, $rootScope, $timeout, $ionicScrollDelegate, LocationService, RestaurantExplorer, RestaurantDetails, AnalyticsTracking, CRITERIA_OPTIONS) {

        findRestaurantsNearby();
        findRestaurantsSavedForLater();
        applyHorizontalScrollFix('nearby-restaurants-scroll');
        applyHorizontalScrollFix('saved-restaurants-scroll');

        var Activity = Parse.Object.extend("Activity");
        var Follow = Activity.extend("Follow");

        $scope.getFeed = function() {
          var currentUser = Parse.User.current();
          Parse.Cloud.run('feed', {
            feed : 'flat:' + currentUser.id
          }).then(function (response) {
            console.log(response.activities);
          });
        };

        $scope.followUser = function() {
          var query = new Parse.Query(Parse.User);
          query.find().then(function(result) {
            console.log(result[3]);
            var user = result[3];
            var follow = new Follow();
            var currentUser = Parse.User.current();

            // configure which feed to write to
            follow.set('feedSlug', 'user');
            follow.set('feedUserId', currentUser.id);
            
            follow.save(
              {
                actor : currentUser,
                verb : 'follow',
                object : user
              }
            ).then(function(result){
              console.log(result);
            }, function(error) {
              console.log(error);
            });
          });
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
            .catch(function (error) {
              console.log('TODO: Handle this error gracefully');
              console.log(error);
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
              console.log(restaurantCollection);
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