(function () {
  var ProfileCtrl = function ($scope, $state, $stateParams, $cordovaStatusbar, $ionicModal, $ionicLoading, $location, $ionicSlideBoxDelegate,
                              RestaurantDetails, PhotoDetails, Lists, FacebookApi, Following, Cards, AutocompleteService, ALL_CUISINE_TYPES) {

    $scope.$on('$ionicView.beforeEnter', function() {
      loadUserData();
      getUserCards();
      getUserLists();
      getFollowingData();
      getFollowerData();
      
      setTimeout( function() { 
        $ionicSlideBoxDelegate.update();
      }, 1000);
    });

    $scope.doRefresh = function () {
      getUserCards();
      getUserLists();
      getFollowingData();
      getFollowerData();

      setTimeout( function() { 
        $ionicSlideBoxDelegate.update();
      }, 1000);
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.showBackButton = $state.current.name === 'tab.publicProfile';

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
      $state.go('tab.photoDetails', {
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
      $state.go('tab.lists', {list: list});
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
      $state.go('tab.following', {
        user: $scope.user,
        // following: $scope.following
      });
    };

    $scope.viewFollowers = function () {
      $state.go('tab.followers', {
        user: $scope.user,
        // followers: $scope.followers
      });
    };

    $scope.restaurantDetails = function (card) {
      console.log(card);
      $state.go('tab.details', {
        venueId: card.attributes.taggedRestaurant.attributes.foursquareId,
        card: card,
        restaurant: card.attributes.taggedRestaurant
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

    function getUserLists() {
      var userLists = $scope.user.relation('lists');
      userLists.query()
      .include('actor')
      .find()
      .then(function (lists) {
        // should move to service
        var listItems = _.map(lists, function (list) {
          var relation = list.relation("cards");

          relation.query().find()
          .then(function (cards) {

            var cardsData = list.attributes;
            cardsData['cardsData'] = cards;

            var cardItems = _.map(cards, function (card) {
              if (card.attributes.photos != undefined && card.attributes.author != undefined) {
                var author = card.attributes.author;
                var photo = card.attributes.photos[0];

                var p1 = author.fetch();
                var p2 = photo.fetch();
              }

              var taggedRestaurant = card.attributes.taggedRestaurant;
              var p3 = taggedRestaurant.fetch();

              return Parse.Promise.when(p3)
                .then(function () {

                });

            });
          });
        });

        $scope.userLists = lists;
        $scope.userListCount = lists.length;
        console.log($scope.userLists);
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
