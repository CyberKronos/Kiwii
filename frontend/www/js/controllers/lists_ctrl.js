(function () {
  var ListsCtrl = function ($scope, $state, $ionicModal, $ionicLoading, RestaurantDetails, ListDetails, Lists, ALL_CUISINE_TYPES) {
    getCardsFromList();

    $scope.doRefresh = function () {
      getCardsFromList();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.removeCard = function (card, index) {
      $scope.cards.splice(index, 1);
      $scope.list.removeCard(card);
    };

    $scope.goToDetails = function (card) {
      $state.go('tab.details', {venueId: card.taggedRestaurant.foursquareId, card: card});
    };

    function getCardsFromList() {
      $scope.list = ListDetails.getListDetails();
      $scope.list.fetchCards()
        .then(function (cards) {
          // TODO: Make Restaurant a ParseObject
          $scope.cards = _.map(cards, function (card) {
            card.taggedRestaurant = card.taggedRestaurant.toJSON();
            return card;
          })
        });
    }

    // Create List Popup

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

    $scope.saveList = function () {
      console.log($scope.newList);
      showLoading('Saving list...');
      Lists.editList($scope.newList)
        .then(function (success) {
          console.log(success);
          hideLoading();
          $scope.closeModal();
        }, function (error) {
          console.log(error);
        });
    };

    $scope.removeList = function (list) {
      console.log(list);
      showLoading('Removing list...');
      Lists.removeList(list)
        .then(function (success) {
          console.log(success);
          hideLoading();
          $scope.closeModal();
          $state.go('tab.profile');
        }, function (error) {
          console.log(error);
        });
    };

    function showLoading(msg) {
      $scope.isLoading = true;
      $ionicLoading.show({
        template: msg
      });
    }

    function hideLoading() {
      $scope.isLoading = false;
      $ionicLoading.hide();
    }

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

    $scope.itemsClicked = function (callback) {
      $scope.callbackValueModel = callback;
      $scope.newList['categoryId'] = callback.item.id;
    };

  };

  angular.module('kiwii')
    .controller('ListsCtrl', ListsCtrl)
})();
