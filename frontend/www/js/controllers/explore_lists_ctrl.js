(function () {
  var ExploreListsCtrl = function ($scope, $state, $timeout, $ionicScrollDelegate, $q, FacebookApi, ListDetails) {

    $scope.showLoading = true;

    getNewsFeed();

    $scope.doRefresh = function () {
      getNewsFeed();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

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

    $scope.goToList = function(listData) {
      console.log(listData);
      ListDetails.setListDetails(listData);
      $state.go('tab.lists');
    };

    $scope.viewProfile = function (userObject) {
        $state.go('tab.publicProfile', {
            userId: userObject.id,
            user: userObject
        });
    };

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

        // Need to move to parse cloud code
        var activities = response.activities;
        activities.forEach(function(value) {
          if (value.verb == 'card') {
            var author = value.object_parse.attributes.author;
            var photo = value.object_parse.attributes.photos[0];
            var taggedRestaurant = value.object_parse.attributes.taggedRestaurant;

            author.fetch();
            photo.fetch();
            taggedRestaurant.fetch();
          }
        });

        console.log(activities);
        $scope.newsFeed = activities;
        $scope.showLoading = false;
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
