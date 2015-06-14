(function () {
  var CardsCtrl = function ($rootScope, $scope, $state, $ionicLoading, RestaurantExplorer, RestaurantDetails, ImagePreloader, AnalyticsTracking) {

    fetchRestaurants().then(preloadRestaurantPhotos);

    AnalyticsTracking.searchQuery($rootScope.searchCriteria);

    var goNextOnSwipe = true;

    $scope.swipeRestaurant = function () {
      var currentRestaurant = undefined;
      if (goNextOnSwipe) {
        currentRestaurant = RestaurantExplorer.nextRestaurant();
      } else {
        currentRestaurant = RestaurantExplorer.prevRestaurant();
      }
      if (!currentRestaurant) {
        $scope.returnToDash();
      }
    };

    $scope.nextRestuarant = function() {
      goNextOnSwipe = true;
    };

    $scope.prevRestuarant = function() {
      goNextOnSwipe = false;
    };

    $scope.restaurantDetails = function (restaurant) {
      // TODO: Pass venue ID through state parameters instead
      RestaurantDetails.setVenueId(restaurant.foursquareId);
      AnalyticsTracking.explorerSelectedVenue(restaurant.foursquareId);
      $state.go('details');
    };

    $scope.returnToDash = function () {
      $state.go('dash');
    };

    function fetchRestaurants() {
      showLoading();
      return RestaurantExplorer.fetch()
        .then(function() {
          $scope.restuarants = RestaurantExplorer.results;
        }, function (error) {
          $scope.apiError = true;
          console.log(error);
        })
        .always(function () {
          hideLoading();
          return $scope.restuarants;
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
  };

  angular.module('kiwii').
    controller('CardsCtrl', CardsCtrl);
})();
