(function () {
  var CardsCtrl = function ($scope, $state, $ionicLoading, $cordovaStatusbar, RestaurantExplorer, RestaurantDetails, ImagePreloader, AnalyticsTracking) {

    fetchCards().then(preloadRestaurantPhotos);
    AnalyticsTracking.searchQuery(RestaurantExplorer.criteria);

    var goNextOnSwipe = true;
    var currentIndex = 0;
    var numberOfResults;

    $scope.isShowingHints = false;
    $scope.criteria = RestaurantExplorer.criteria;

    $scope.swipeRestaurant = function () {
      $scope.showSwipeHints(false);
      if (goNextOnSwipe) {
        RestaurantExplorer.nextRestaurant();
      } else {
        RestaurantExplorer.prevRestaurant();
      }
    };

    $scope.nextRestaurant = function () {
      goNextOnSwipe = true;
      currentIndex++;
      console.log(currentIndex);
      if (currentIndex >= numberOfResults) {
        showBackdropMessage({
          icon: 'ion-android-search calm',
          message: 'You have viewed all the restaurants found under your criteria.'
        });
      }
    };

    $scope.prevRestaurant = function () {
      goNextOnSwipe = false;
      currentIndex--;
      console.log(currentIndex);
      if (currentIndex < 0) {
        $state.go('tab.search');
      }
    };

    $scope.showSwipeHints = showSwipeHints;

    function fetchCards() {
      showLoading();
      return RestaurantExplorer.fetch()
        .then(function () {
          $scope.cards = RestaurantExplorer.results;
          numberOfResults = $scope.cards.length;
          if (numberOfResults <= 0) {
            showBackdropMessage({
              icon: 'ion-android-search calm',
              message: 'We cannot find any restaurants within the criteria you specified!'
            });
          }
          // TODO: Make Restaurants a ParseObject
          _.forEach($scope.cards, function (card) {
            card.taggedRestaurant = card.taggedRestaurant.toJSON();
          });
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
      console.log('showineg message');
      $scope.backdropMessage = settings.message || 'ion-sad-outline';
      $scope.backdropIcon = settings.icon
        || 'Sorry, something went wrong! Try making a search again.';
    }
  };

  angular.module('kiwii').
    controller('CardsCtrl', CardsCtrl);
})();
