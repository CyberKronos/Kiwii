(function () {
  var DetailsCtrl = function ($rootScope, $scope, $stateParams, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicModal, $cordovaInAppBrowser, $cordovaStatusbar, $q,
                              RestaurantDetails, Lists, Cards, RestaurantRatingPopup, AppModalService, ViewedHistory) {

    var PHOTO_SIZE = '500x500';

    recordHistory($stateParams);
    getRestaurantInfo();

    var userLists = Parse.User.current().relation('lists');
    userLists.query().find()
      .then(function (lists) {
        $scope.userLists = lists;
        console.log($scope.userLists);
      });

    $scope.doRefresh = function () {
      getRestaurantInfo();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.$on('$destroy', function () {
      if ($scope.modal) {
        $scope.modal.remove();
      }
    });

    $scope.openAddCardModal = function () {
      AppModalService.show('app/cardCreation/add_card_modal.html', 'AddCardModalCtrl', {
        // TODO: Pass in a Parse.Object('Restaurant') instead after RestaurantDetails becomes a Parse object
        taggedRestaurant: {
          foursquareId: $scope.restaurantDetails.id,
          name: $scope.restaurantDetails.name
        }
      });
    };

    $scope.openRatingModal = function () {
      RestaurantRatingPopup.askForRating($scope.restaurantDetails.id, Parse.User.current().get('fbId'));
    };

    $scope.addToList = function () {
      openAddToListModal()
        .then(function (modal) {
          modal.show();
        })
    };

    $scope.saveToList = function (list) {
      var cardPromise = $scope.card ? $q.when($scope.card) : Cards.getDefaultCard($stateParams.restaurant);
      cardPromise
        .then(function (card) {
          list.addCard(card);
          $rootScope.listSaveRN = $stateParams.restaurant.name;
          $rootScope.listSaveLN = list.attributes.name;
        })
        .then(function () {
          $scope.modal.hide();
          createPopover();
        });
    };

    $scope.getFeaturePhotoUrl = function (restaurantDetails) {
      if (restaurantDetails && restaurantDetails.bestPhoto) {
        return restaurantDetails.bestPhoto.prefix + PHOTO_SIZE + restaurantDetails.bestPhoto.suffix;
      } else {
        return null;
      }
    };

    function getRestaurantInfo() {
      // TODO: Update cards schema so this 'conversion' is not needed
      var card = $stateParams.card;
      $scope.card = card;
      if (card && !card.externalSource) {
        _.merge(card, {
          coverPhoto: card.photos[0],
          description: card.photos[0].description,
          author: card.author
        });
        if (card.author.toJSON) {
          card.author = card.author.toJSON();
        }
      }
      RestaurantDetails.fetchVenue($stateParams.venueId).then(
        function (result) {
          $scope.detailsAttributes = [];
          var detailsAttributes = result.details.attributes.groups;
          angular.forEach(detailsAttributes, function (attribute, key) {
            angular.forEach(attribute.items, function (value, key) {
              $scope.detailsAttributes.push({
                'name': value.displayName,
                'value': value.displayValue
              });
            });
          });

          $scope.restaurantDetails = result.details;
          $scope.instagramImages = result.images;
          $scope.restaurantReviews = result.reviews;
        }
      );
    }

    function openAddToListModal() {
      if ($scope.modal) {
        return $q.when($scope.modal);
      } else {
        return $ionicModal.fromTemplateUrl('app/lists/add_to_list_popup.html', {
          scope: $scope,
          animation: 'slide-in-up'
        })
          .then(function (modal) {
            $scope.modal = modal;
            return modal;
          });
      }
    }

    function createPopover() {
      $ionicLoading.show({
        templateUrl: 'app/lists/favourites_popup.html',
        hideOnStateChange: true,
        noBackdrop: true,
        duration: 2500
      });
    }

    function errorMsgPopover() {
      $ionicLoading.show({
        templateUrl: 'app/lists/error_msg_list_popup.html',
        hideOnStateChange: true,
        noBackdrop: true,
        duration: 2500
      });
    }

    function recordHistory(params) {
      ViewedHistory.record(Parse.User.current().id, {
        foursquareId: params.venueId,
        cardId: params.card ? params.card.id : undefined
      });
    }
  };

  angular.module('kiwii').
    controller('DetailsCtrl', DetailsCtrl);
})();
