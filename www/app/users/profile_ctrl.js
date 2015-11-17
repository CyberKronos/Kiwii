(function () {
  var ProfileCtrl = function ($scope, $state, $stateParams, $cordovaStatusbar, $ionicModal, $ionicLoading, $location, $ionicSlideBoxDelegate,
                              $timeout, RestaurantDetails, Lists, FacebookApi, Following, Cards, AutocompleteService, SavedForLater) {

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
      SavedForLater.get()
        .then(_.method('fetchCards'))
        .then(function (cards) {
          $scope.cards = cards;
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

    $scope.showBackButton = $state.current.name === 'publicProfile';

    $scope.newList = {};

    $ionicModal.fromTemplateUrl('app/lists/create_list_popup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

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

    $scope.listDetails = function (list) {
      $state.go('listDetails', {list: list});
    };

    $scope.selectedIndex = 0;
    $scope.segmentChange = function (index) {
      $scope.selectedIndex = index;
      $scope.$apply();
    }

    $scope.callbackValueModel = "";

    $scope.getCuisineItems = function (query) {
      return AutocompleteService.getCuisineItems(query);
    };

    $scope.itemsClicked = function (callback) {
      $scope.callbackValueModel = callback;
      $scope.newList['categoryId'] = callback.item.id;
    };

    $scope.viewFollowing = function () {
      $state.go('following', {
        user: $scope.user,
        // following: $scope.following
      });
    };

    $scope.viewFollowers = function () {
      $state.go('followers', {
        user: $scope.user,
        // followers: $scope.followers
      });
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

    function getUserCards() {
      Cards.getUserCards($scope.user.id)
        .then(function (userCards) {
          console.log(userCards);
          $scope.userCards = userCards;
          $scope.userCardsCount = userCards.length;
          $scope.photos = _(userCards).pluck('photos').flatten().value();
        });
    }

    function getUserLists() {
      var userLists = $scope.user.relation('lists');
      return userLists.query()
        .include('actor')
        .find()
        .then(function (lists) {
          var listItems = _.map(lists, function (list) {
            var fetchCards = list.fetchCards()
              .then(function (cards) {
                $scope.cards = _.map(cards, function (card) {
                  card.taggedRestaurant = card.taggedRestaurant.toJSON();
                  return card;
                });
                return Parse.Promise.when($scope.cards);
              });
            return Parse.Promise.when(fetchCards)
              .then(function () {
                return list;
              });
          });
          return Parse.Promise.when(listItems)
            .then(function () {
              return lists;
            });
        });
    }

    function getCardsFromList() {
      // TODO: Null check for list
      $scope.favoritesList.fetchCards()
        .then(function (cards) {
          console.log(cards);
          // TODO: Make Restaurant a ParseObject
          $scope.cards = _.map(cards, function (card) {
            card.taggedRestaurant = card.taggedRestaurant.toJSON();
            console.log(card);
            return card;
          })
        });
    }

    function getFollowingData() {
      Following.followingList($scope.user)
        .then(function (result) {
          $scope.followingCount = result.length;
          // $scope.following = result;
        });
    }

    function getFollowerData() {
      Following.followerList($scope.user)
        .then(function (result) {
          $scope.followerCount = result.length;
          // $scope.followers = result;
        });
    }
  };

  angular.module('kiwii')
    .controller('ProfileCtrl', ProfileCtrl)
})();
