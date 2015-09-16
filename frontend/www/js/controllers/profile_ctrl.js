(function () {
  var ProfileCtrl = function ($scope, $state, $stateParams, $cordovaStatusbar, $ionicModal, $ionicLoading, $location,
                              RestaurantDetails, PhotoDetails, Lists, FacebookApi, Following, Cards, ALL_CUISINE_TYPES) {

    $scope.$on('$ionicView.beforeEnter', function() {
      loadUserData();
      getUserCards();
      getUserLists();
      getFollowingData();
      getFollowerData();
    });

    $scope.doRefresh = function () {
      getUserCards();
      getUserLists();
      getFollowingData();
      getFollowerData();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.showBackButton = $state.current.name === 'tab.publicProfile';

    $scope.newList = {};

    $ionicModal.fromTemplateUrl('templates/create_list_popup.html', {
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

    $scope.callbackValueModel = "";

    $scope.getCuisineItems = function (query) {
      var searchItems = ALL_CUISINE_TYPES.CUISINE_TYPES;
      var returnValue = {items: []};
      searchItems.forEach(function (item) {
        if (item.name.toLowerCase().indexOf(query) > -1) {
          returnValue.items.push(item);
        }
        else if (item.id.toLowerCase().indexOf(query) > -1) {
          returnValue.items.push(item);
        }
      });
      return returnValue;
    };

    $scope.viewFollowing = function () {
      $state.go('tab.following', {
        user: $scope.user,
        following: $scope.following
      });
    };

    $scope.viewFollowers = function () {
      $state.go('tab.followers', {
        user: $scope.user,
        followers: $scope.followers
      });
    };

    $scope.itemsClicked = function (callback) {
      $scope.callbackValueModel = callback;
      $scope.newList['categoryId'] = callback.item.id;
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
        $scope.userLists = lists;
        $scope.userListCount = lists.length;
        console.log($scope.userLists);
      });
    }

    function getFollowingData() {
      Following.followingList($scope.user)
        .then(function (result) {
          $scope.followingCount = result.length;
          $scope.following = result;
        });
    }

    function getFollowerData() {
      Following.followerList($scope.user)
        .then(function (result) {
          $scope.followerCount = result.length;
          $scope.followers = result;
        });
    }
  };

  angular.module('kiwii')
    .controller('ProfileCtrl', ProfileCtrl)
})();
