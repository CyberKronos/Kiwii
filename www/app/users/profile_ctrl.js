(function () {
  var ProfileCtrl = function ($scope, $state, $stateParams, $cordovaStatusbar, $ionicModal, $ionicLoading, $location, $ionicSlideBoxDelegate,
                              $timeout, RestaurantDetails, Lists, FacebookApi, Cards, SavedForLater) {

    $scope.$on('$ionicView.beforeEnter', function () {
      updatePage();
    });

    $scope.doRefresh = function () {
      updatePage();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.removeFromSave = removeFromSave;

    function updatePage() {
      $timeout(function () {
        loadUserData();
        getFavoritesList();
      }, 0);
    }
    
    function getFavoritesList() {
      $scope.loading = true;
      SavedForLater.get()
        .then(_.method('fetchCards'))
        .then(function (cards) {
          $scope.cards = cards;
          $scope.loading = false;
        })
    }

    function removeFromSave(cards, index) {
      var card = cards[index];
      $scope.cards.splice(index, 1);
      SavedForLater.get()
        .then(function (list) {
          return list.removeCard(card);
        })
        .catch(function (error) {
          console.log(error);
        })
    }

    $scope.newList = {};

    $scope.photoDetails = function (card) {
      $state.go('photoDetails', {
        card: card
      });
    };

    $scope.createList = function () {
      $scope.newList = {};
      $scope.newList['type'] = 'create';
      console.log($scope.newList);
      $scope.openModal();
    };

    $scope.saveList = function () {
      showLoading();
      Lists.saveList($scope.newList)
        .then(function (success) {
          console.log(success);
          hideLoading();
          $scope.closeModal();
        }, function (error) {
          console.log(error);
        });
    };


    $scope.itemsClicked = function (callback) {
      $scope.callbackValueModel = callback;
      $scope.newList['categoryId'] = callback.item.id;
    };


    $scope.restaurantDetails = function (card) {
      console.log(card);
      $state.go('details', {
        venueId: card.taggedRestaurant.foursquareId,
        card: card,
        restaurant: card.taggedRestaurant
      });
    };

    $scope.goToDetails = function (card) {
      $state.go('details', {
        venueId: card.taggedRestaurant.foursquareId,
        card: card,
        restaurant: card.taggedRestaurant
      });
    };

    function showLoading() {
      $scope.isLoading = true;
      $ionicLoading.show({
        template: 'Creating list...'
      });
    }

    function hideLoading() {
      $scope.isLoading = false;
      $ionicLoading.hide();
    }

    function loadUserData() {
      var selectedUser = $stateParams.user || Parse.User.current();
      $scope.userData = selectedUser.attributes;
      $scope.user = selectedUser;
    }
  };

  angular.module('kiwii')
    .controller('ProfileCtrl', ProfileCtrl)
})();
