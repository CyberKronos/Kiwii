(function() {
    var ExploreListsCtrl = function($scope, $state, $timeout, $ionicScrollDelegate) {

        getNewsFeed();

        $scope.doRefresh = function() {
          getNewsFeed();
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        };

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
    };

    angular.module('kiwii')
        .controller('ExploreListsCtrl', ExploreListsCtrl)
})();
