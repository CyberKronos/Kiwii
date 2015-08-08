(function () {
  var CardsCtrl = function ($scope, $state, $ionicLoading, $cordovaStatusbar, RestaurantExplorer, RestaurantDetails, ImagePreloader, AnalyticsTracking) {

    if (window.cordova) { 
      $cordovaStatusbar.style(0);
    }

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

    $scope.restaurantDetails = function (restaurant) {
      // TODO: Pass venue ID through state parameters instead
      RestaurantDetails.setVenueId(restaurant.foursquareId);
      AnalyticsTracking.explorerSelectedVenue(restaurant.foursquareId);
      $state.go('tab.details');
    };

    $scope.returnToDash = function () {
      $state.go('tab.search');
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

    function preloadRestaurantPhotos(restaurants) {
      return ImagePreloader.preloadImages(_.map(restaurants, function (r) {
        return r['imageUrl'];
      }));
    }

    function showSwipeHints(option) {
      console.log(option);
      $scope.isShowingHints = option;
    }
  };

  angular.module('kiwii').
    controller('CardsCtrl', CardsCtrl);
})();
