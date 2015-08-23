(function() {
    var ExploreListsCtrl = function($scope, $state, $timeout, $ionicScrollDelegate, FacebookApi) {

        applyHorizontalScrollFix('people-suggestions-scroll');
        getNewsFeed();
        getNewUsers();

        $scope.doRefresh = function() {
          getNewsFeed();
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        };

        // $scope.getSelfFeed = function() {
        //   var currentUser = Parse.User.current();
        //   Parse.Cloud.run('feed', {
        //     feed : 'user:' + currentUser.id
        //   }).then(function (response) {
        //     console.log(response.activities);
        //     // $scope.newsFeed = response.activities;
        //   });
        // };

        $scope.getRestaurantName = function(foursquareId) {
          var Restaurants = Parse.Object.extend('Restaurants');
          var restaurant = new Parse.Query(Restaurants);
          restaurant.get(foursquareId)
            .then(function (result) {
              return result.attributes.name;
            }, function (error) {
              console.log(error);
            });
        };

        $scope.restaurantDetails = function (foursquareId) {
          // TODO: Pass venue ID through state parameters instead
           $state.go('tab.details', {venueId: foursquareId});
        };

        // Maybe should move to a service
        function getNewUsers() {
          FacebookApi.getFriendsInApp()
            .then(function(response) {
              angular.forEach(response.data, function(value, key) {
                var fbId = value.id;
                getParseUserInfo(fbId)
                  .then(function (result) {
                    if (result != 'no results') {
                      value['userObject'] = result;
                    }
                  });
              });
              $scope.suggestedUsers = response.data;
              console.log($scope.suggestedUsers);
            });
        }

        function getParseUserInfo(fbId) {
          var query = new Parse.Query(Parse.User);
          query.equalTo("fbId", fbId);
          return query.find()
            .then(function (result) {
              if (result[0]) {
                return result[0];
              } else {
                return 'no results';
              }
            }, function (error) {
                console.log(error);
                return 'no results';
            });
        }

        function getNewsFeed() {
          var currentUser = Parse.User.current();
          Parse.Cloud.run('feed', {
            feed : 'flat:' + currentUser.id
          }).then(function (response) {
            angular.forEach(response.activities, function(value, key) {
              if (value.verb == 'photo') {
                getRestaurantName(value.object_parse.attributes.restaurant.id)
                  .then(function (result) {
                    value.object_parse.attributes.restaurant = result;
                  });
              }
            });
            $scope.newsFeed = response.activities;
            console.log($scope.newsFeed);
          });
        }

        function getRestaurantName(foursquareId) {
          var Restaurants = Parse.Object.extend('Restaurants');
          var restaurant = new Parse.Query(Restaurants);
          return restaurant.get(foursquareId)
              .then(function (result) {
                  return result.attributes;
              }, function (error) {
                  console.log(error);
                  return;
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
    
    };

    angular.module('kiwii')
        .controller('ExploreListsCtrl', ExploreListsCtrl)
})();
