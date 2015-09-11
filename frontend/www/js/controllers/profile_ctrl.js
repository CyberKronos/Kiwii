(function () {
  var ProfileCtrl = function ($scope, $state, $stateParams, $cordovaStatusbar, $ionicModal, $ionicLoading, $location,
                              RestaurantDetails, RestaurantPreference, PhotoDetails, Lists, ListDetails, FacebookApi, Following, Cards, ALL_CUISINE_TYPES) {

    loadUserData();
    getUserCards();
    getUserLists();
    getFollowingCount();
    getFollowerCount();

    var saveForLaterList = {
      name: 'Save for Later',
      description: 'Save the restaurants you want to check out later.',
      category: 'All restaurants'
    };

    $scope.doRefresh = function () {
      getUserCards();
      getUserLists();
      getFollowingCount();
      getFollowerCount();
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
      if (list == 'saveForLater') {
        ListDetails.setListDetails(saveForLaterList);
      } else {
        ListDetails.setListDetails(list);
      }
      $state.go('tab.lists');
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

    $scope.viewFollowing = function() {
      $state.go('tab.following', {
        user: $scope.user
      });
    };

    $scope.viewFollowers = function() {
      $state.go('tab.followers', {
        user: $scope.user
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
      userLists.query().find()
        .then(function (lists) {
          $scope.userLists = lists;
          $scope.userListCount = lists.length;
          console.log($scope.userLists);
        });
    }

    function getFollowingCount() {
      Following.followingList($scope.user)
        .then(function (result) {
          $scope.followingCount = result.length;
        });
    }

    function getFollowerCount() {
      Following.followerList($scope.user)
        .then(function (result) {
          $scope.followerCount = result.length;
        });
    }
  };

  angular.module('kiwii')
    .controller('ProfileCtrl', ProfileCtrl)
})();
