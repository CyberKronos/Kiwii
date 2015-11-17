(function () {
  var CardsCtrl = function ($scope, $q, $state, $stateParams, $ionicLoading, $cordovaStatusbar, Cards,
                            RestaurantExplorer, RestaurantDetails, ImagePreloader, AnalyticsTracking, Restaurants) {

    fetchCards().then(preloadRestaurantPhotos);
    AnalyticsTracking.searchQuery($stateParams.criteria);

    var goNextOnSwipe = true;
    var exploreResults = [];
    var currentIndex = 0;
    var numberOfResults = 0;

    $scope.isShowingHints = false;
    $scope.criteria = $stateParams.criteria;

    $scope.swipeRestaurant = function () {
      $scope.cards = _.slice(exploreResults, currentIndex);
    };

    $scope.nextRestaurant = function () {
      goNextOnSwipe = true;
      currentIndex++;
      if (currentIndex >= numberOfResults) {
        showBackdropMessage({
          icon: 'ion-ios-search assertive',
          message: 'You have viewed all the restaurants found under your criteria.'
        });
      }
    };

    $scope.prevRestaurant = function () {
      goNextOnSwipe = false;
      currentIndex--;
      if (currentIndex < 0) {
        $state.go('search');
      }
    };

    $scope.showSwipeHints = showSwipeHints;

    function fetchCards() {
      showLoading();
      return RestaurantExplorer.exploreWithExternal($stateParams.criteria)
        .then(function (results) {
          exploreResults = results;
          numberOfResults = exploreResults.length;
          $scope.cards = _.clone(exploreResults);
          if (numberOfResults <= 0) {
            showBackdropMessage({
              icon: 'ion-ios-search assertive',
              message: 'We cannot find any restaurants within the criteria you specified!'
            });
          }
          console.log($scope.cards);
          return $scope.cards;
        })
        .fail(function (message) {
          showBackdropMessage({
            icon: 'ion-sad-outline',
            message: 'Sorry, something went wrong! Try making a search again.'
          });
          return Parse.Promise.error(message);
        })
        .always(function () {
          hideLoading();
          return $scope.cards;
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

    function preloadRestaurantPhotos(cards) {
      return ImagePreloader.preloadImages(_.pluck(cards, 'taggedRestaurant.imageUrl'));
    }

    function showBackdropMessage(settings) {
      $scope.backdropMessage = settings.message || 'ion-sad-outline';
      $scope.backdropIcon = settings.icon
        || 'Sorry, something went wrong! Try making a search again.';
    }
  };

  angular.module('kiwii').
    controller('CardsCtrl', CardsCtrl);
})();
