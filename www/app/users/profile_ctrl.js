(function () {
  var ProfileCtrl = function ($scope, $state, $stateParams, $cordovaStatusbar, $ionicModal, $ionicLoading, $location, $ionicSlideBoxDelegate,
                              RestaurantDetails, PhotoDetails, Lists, FacebookApi, Following, Cards, AutocompleteService, ALL_CUISINE_TYPES) {

    $scope.$on('$ionicView.beforeEnter', function() {
      loadUserData();
      getUserCards();
    //  getUserLists();
      getFavoritesList()
      getFollowingData();
      getFollowerData();

      setTimeout( function() {
        $ionicSlideBoxDelegate.update();
      }, 1000);
    });

    $scope.doRefresh = function () {
      getUserCards();
   //   getUserLists();
      getFavoritesList()
      getFollowingData();
      getFollowerData();

      setTimeout( function() {
        $ionicSlideBoxDelegate.update();
      }, 1000);
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

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
    $scope.segmentChange = function(index){
      $scope.selectedIndex = index;
      $scope.$apply();
    }

    $scope.callbackValueModel = "";

    $scope.getCuisineItems = function(query) {
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

    console.log($stateParams.user);

    function loadUserData() {
      if ($stateParams.user) {
        $scope.userData = $stateParams.user.attributes;
        $scope.user = $stateParams.user;
      } else {
        $scope.userData = Parse.User.current().attributes;
        $scope.user = Parse.User.current();
      }
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

    function getFavoritesList() {
      getUserLists();
      getCardsFromList();
    }

    function getUserLists() {
      var userLists = $scope.user.relation('lists');
      userLists.query()
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
      })
      .then(function (lists) {
        // $scope.userLists = lists;
        // console.log($scope.userLists);

        // Get favorites list
        $scope.favoritesList = lists[0];
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
