(function () {
  var CardsCtrl = function ($scope, $ionicLoading, $cordovaStatusbar, RestaurantExplorer, RestaurantDetails, ImagePreloader, AnalyticsTracking) {

    fetchRestaurants().then(preloadRestaurantPhotos);

    AnalyticsTracking.searchQuery(RestaurantExplorer.criteria);

    var goNextOnSwipe = true;
    $scope.isShowingHints = false;

    $scope.criteria = RestaurantExplorer.criteria;

    $scope.swipeRestaurant = function () {
      var currentRestaurant = undefined;
      $scope.showSwipeHints(false);
      if (goNextOnSwipe) {
        currentRestaurant = RestaurantExplorer.nextRestaurant();
      } else {
        currentRestaurant = RestaurantExplorer.prevRestaurant();
      }
      if (!currentRestaurant) {
        $scope.returnToDash();
      }
    };

    $scope.nextRestaurant = function() {
      goNextOnSwipe = true;
    };

    $scope.prevRestaurant = function() {
      goNextOnSwipe = false;
    };

    $scope.showSwipeHints = showSwipeHints;

    function fetchRestaurants() {
      showLoading();
      return RestaurantExplorer.fetch()
        .then(function() {
          $scope.restaurants = RestaurantExplorer.results;
          console.log($scope.restaurants);
        }, function (error) {
          $scope.apiError = true;
          console.log(error);
        })
        .always(function () {
          hideLoading();
          return $scope.restaurants;
        });
    }

    function showLoading() {
      $scope.isLoading = true;
      $ionicLoading.show({
        template: 'Searching...'
      });
    }

    function hideLoading() {
      $scope.isLoading = false;
      $ionicLoading.hide();
    }

    function showSwipeHints(option) {
      $scope.isShowingHints = option;
    }

    function preloadRestaurantPhotos(restaurants) {
      return ImagePreloader.preloadImages(_.map(restaurants, function (r) {
        return r['imageUrl'];
      }));
    }
  };

  angular.module('kiwii').
    controller('CardsCtrl', CardsCtrl);
})();
