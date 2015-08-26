(function () {
  var ExploreListsCtrl = function ($scope, $state, $timeout, $ionicScrollDelegate, $q, FacebookApi) {

    getNewsFeed();

    $scope.doRefresh = function () {
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

    $scope.getNewUsers = getNewUsers;

    $scope.getRestaurantName = function (foursquareId) {
      var Restaurants = Parse.Object.extend('Restaurants');
      var restaurant = new Parse.Query(Restaurants);
      restaurant.get(foursquareId)
        .then(function (result) {
          return result.attributes.name;
        }, function (error) {
          console.log(error);
        });
    };

    // Maybe should move to a service
    function getNewUsers() {
      return FacebookApi.getFriendsInApp()
        .then(function (response) {
          var userInfoPromises = _.map(response.data, function (value) {
            var fbId = value.id;
            return getParseUserInfo(fbId)
              .then(function (result) {
                if (result != 'no results') {
                  value['userObject'] = result;
                }
                return value;
              });
          });
          console.log(userInfoPromises);
          return $q.all(userInfoPromises);
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
        feed: 'flat:' + currentUser.id
      }).then(function (response) {
        angular.forEach(response.activities, function (value, key) {
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
