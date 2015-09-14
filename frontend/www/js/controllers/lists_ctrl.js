(function () {
  var ListsCtrl = function ($scope, $state, $ionicModal, $ionicLoading, RestaurantDetails, ListDetails, Lists, ALL_CUISINE_TYPES) {
    loadListData();

    $ionicModal.fromTemplateUrl('templates/create_list_popup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.doRefresh = function () {
      loadListData();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.openModal = function () {
      $scope.modal.show();
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.editList = function () {
      $scope.newList = {
        type: 'edit',
        objectId: $scope.listData.id,
        category: $scope.listData.attributes.category,
        description: $scope.listData.attributes.description,
        name: $scope.listData.attributes.name
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

    $scope.removeList = function (listData) {
      console.log(listData);
      showLoading('Removing list...');
      Lists.removeList(listData)
        .then(function (success) {
          console.log(success);
          hideLoading();
          $scope.closeModal();
          $state.go('tab.profile');
        }, function (error) {
          console.log(error);
        });
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

    $scope.itemsClicked = function (callback) {
      $scope.callbackValueModel = callback;
      $scope.newList['categoryId'] = callback.item.id;
    };

    $scope.removeRestaurant = function (index, restaurant) {
      $scope.restaurantList.splice(index, 1);
      Lists.removeRestaurantListRelation($scope.listData, restaurant.foursquareId)
        .then(function () {
          console.log('Removed');
        });
    };

    $scope.goToDetails = function (restaurant) {
      $state.go('tab.details', {venueId: restaurant.foursquareId});
    };

    function loadListData() {
      $scope.listData = ListDetails.getListDetails();
      var restaurants = $scope.listData.relation('restaurants');
      return restaurants.query().collection().fetch()
        .then(function (restaurants) {
          $scope.restaurantList = restaurants.toJSON();
        });
    }

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
  };

  angular.module('kiwii')
    .controller('ListsCtrl', ListsCtrl)
})();
