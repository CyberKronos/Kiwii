(function () {
  var ListsCtrl = function ($scope, $state, $stateParams, $cordovaStatusbar, $ionicModal, $ionicLoading, $location, $ionicSlideBoxDelegate,
                              RestaurantDetails, PhotoDetails, Lists, FacebookApi, Following, Cards, AutocompleteService, ALL_CUISINE_TYPES) {

    $scope.list = $stateParams.list;
    getCardsFromList($stateParams.list);

    $scope.$on('$ionicView.beforeEnter', function() {
      loadUserData();
      getUserLists();
      
      setTimeout( function() { 
        $ionicSlideBoxDelegate.update();
      }, 1000);
    });

    $scope.doRefresh = function () {
      getUserLists();

      setTimeout( function() { 
        $ionicSlideBoxDelegate.update();
      }, 1000);
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.listDetails = function (list) {
      $state.go('listDetails', {list: list});
    };

    $scope.restaurantDetails = function (card) {
      console.log(card);
      $state.go('details', {
        venueId: card.taggedRestaurant.foursquareId,
        card: card,
        restaurant: card.taggedRestaurant
      });
    };

    function getCardsFromList(list) {
      list.fetchCards()
        .then(function (cards) {
          $scope.cards = cards;
        });
    }
    function loadUserData() {
      if ($stateParams.user) {
        $scope.userData = $stateParams.user.attributes;
        $scope.user = $stateParams.user;
      } else {
        $scope.userData = Parse.User.current().attributes;
        $scope.user = Parse.User.current();
      }
    }

    // Create List Popup
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

    $scope.editList = function () {
      $scope.newList = {
        type: 'edit',
        objectId: $scope.list.id,
        category: $scope.list.attributes.category,
        description: $scope.list.attributes.description,
        name: $scope.list.attributes.name
      };
      console.log($scope.newList);
      $scope.openModal();
    };

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
        $scope.userLists = lists;
        console.log($scope.userLists);
      });
    }
  };

  angular.module('kiwii')
    .controller('ListsCtrl', ListsCtrl)
})();
