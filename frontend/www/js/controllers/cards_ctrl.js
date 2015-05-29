(function () {
  var CardsCtrl = function ($rootScope, $scope, $state, $ionicLoading, InstagramApi, FoursquareApi, RestaurantDetails, ImagePreloader) {

    var previousRestuarants = [];
    var goNextOnSwipe = true;

    fetchRestaurants($rootScope.searchCriteria)
      .then(preloadRestaurantPhotos);

    $scope.swipeRestaurant = function (index) {
      console.log('Swiping Card');
      if (goNextOnSwipe) {
        $scope.fetchNextRestaurant(index);
      } else {
        $scope.fetchPrevRestaurant(index);
      }
    };

    $scope.fetchNextRestaurant = function (index) {
      previousRestuarants.push($scope.restuarants[index]);
      $scope.restuarants.splice(index, 1);
      console.log($scope.restuarants);
      console.log(previousRestuarants);
      if ($scope.restuarants <= 0) {
        $state.go('dash');
      }
    };

    $scope.fetchPrevRestaurant = function (index) {
      if (previousRestuarants.length > 0) {
        var lastRestuarant = previousRestuarants.pop();
        console.log(lastRestuarant);
        $scope.restuarants.splice(index, 0, lastRestuarant);
      } else {
        $state.go('dash');
      }
      console.log($scope.restuarants);
      console.log(previousRestuarants);
    };

    $scope.nextRestuarant = function() {
      console.log('Swiped Left');
      goNextOnSwipe = true;
    };

    $scope.prevRestuarant = function() {
      console.log('Swiped Right');
      goNextOnSwipe = false;
    };

    $scope.restaurantDetails = function (restaurant) {
      // TODO: Pass venue ID through state parameters instead
      RestaurantDetails.setVenueId(restaurant.foursquareId);
      $state.go('details');
    };

    $scope.returnToDash = function () {
      $state.go('dash');
    };

    function fetchRestaurants(searchCriteria) {
      showLoading();
      return FoursquareApi.exploreRestaurants(searchCriteria)
        .then(function (response) {
          $scope.restuarants = response;
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

  angular.module('app').
    controller('CardsCtrl', CardsCtrl);
})();
