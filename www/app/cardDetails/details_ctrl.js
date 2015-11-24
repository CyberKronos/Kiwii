(function () {
  var DetailsCtrl = function ($rootScope, $scope, $stateParams, $ionicLoading, $timeout, $ionicSlideBoxDelegate,
                              $ionicScrollDelegate, $ionicModal, BrowserService, $cordovaStatusbar, $q,
                              RestaurantDetails, Lists, Cards, RestaurantRatingPopup, AppModalService, ViewedHistory,
                              SavedForLater) {

    $scope.$on('$ionicView.beforeEnter', function () {
      getRestaurantInfo();
      $timeout(function () {
        $ionicSlideBoxDelegate.update();
      }, 1500);
    });

    var PHOTO_SIZE = '500x500';

    recordHistory($stateParams);

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

    $scope.toggleSave = toggleSave;
    $scope.isSaved = false;

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

    $scope.openWebsite = BrowserService.open;

    $scope.zoomMin = 1;

    $scope.showImages = function (index) {

      $scope.activeSlide = index;
      $scope.showModal('app/photos/photos_zoomview.html');
    };

    $scope.showModal = function (templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

    $scope.closeModal = function () {
      $scope.modal.hide();
      $scope.modal.remove()
    };

    $scope.updateSlideStatus = function (slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    function getRestaurantInfo() {
      var cardQ = resolveRestaurantCard()
        .then(updateCardSaveState);
      var venueQ = RestaurantDetails.fetchVenue($stateParams.venueId).then(
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
          console.log($scope.instagramImages);
          $scope.restaurantReviews = result.reviews;
        }
      );
      return $q.all(cardQ, venueQ);
    }

    function resolveRestaurantCard() {
      var cardQ = $stateParams.card ? $q.when($stateParams.card) : Cards.getDefaultCard($stateParams.restaurant);
      return cardQ.then(function (card) {
        $scope.card = card;
        return $scope.card;
      });
    }

    function updateCardSaveState(card) {
      return SavedForLater.get()
        .then(function (list) {
          return list.containsCard(card);
        })
        .then(function (result) {
          $scope.isSaved = result;
        });
    }

    function toggleSave(card) {
      var currentState = $scope.isSaved;
      var toggle = !$scope.isSaved ? 'addCard' : 'removeCard';
      return SavedForLater.get()
        .then(_.method(toggle, card))
        .then(function () {
          $scope.isSaved = !currentState;
        })
        .catch(function (error) {
          $scope.isSaved = currentState;
          console.log(error);
        });
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
