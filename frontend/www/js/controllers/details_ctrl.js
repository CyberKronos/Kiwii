(function () {
  var DetailsCtrl = function ($rootScope, $scope, $stateParams, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicModal, $cordovaInAppBrowser, $cordovaStatusbar, $q,
                              RestaurantPreference, RestaurantDetails, Lists, RestaurantRatingPopup, AppModalService, AnalyticsTracking, ViewedHistory) {

    var PHOTO_SIZE = '500x500';
    var restaurantPreference = null;

    recordHistory($stateParams);
    getRestaurantInfo();

    AnalyticsTracking.explorerSelectedVenue($stateParams.venueId)
      .then(function (result) {
        console.log(result);
      });

    var userLists = Parse.User.current().relation('lists');
    userLists.query().find()
      .then(function (lists) {
        $scope.userLists = lists;
        console.log($scope.userLists);
        $scope.$digest();
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
      AppModalService.show('templates/edit_image_popup.html', 'AddCardModalCtrl', {
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

    $scope.openWebsite = function (link) {
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
        // toolbarposition: 'top'
      };

      // to change window to $cordovaInAppBrowser to get options
      // but it will break
      $cordovaInAppBrowser.open(link, '_blank', options);
    };

    $scope.addToList = function () {
      openAddToListModal()
        .then(function (modal) {
          modal.show();
        })
    };

    $scope.saveToList = function (list) {
      if (list == 'saveForLater') {
        restaurantPreference.set(!$scope.isFavourite)
          .then(function () {
            $scope.isFavourite = !$scope.isFavourite;
            if ($scope.isFavourite) {
              $scope.modal.hide();
              createPopover();
            }
          });
      } else {
        Lists.saveRestaurantListRelation(list, $scope.restaurantDetails.id)
          .then(function (result) {
            if (result == 'Restaurant is already in list') {
              errorMsgPopover();
            } else {
              $scope.modal.hide();
              createPopover();
            }
          });
      }
    };

    $scope.openPhotoDetails = function (photo) {
      if (photo && !photo.has('externalSource')) {
        $state.go('tab.photoDetails', {
          photo: photo
        });
      }
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
      if (card) {
        $scope.card = card;
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
      ).then(function () {
          restaurantPreference = new RestaurantPreference(Parse.User.current(), $stateParams.venueId);
          return restaurantPreference.isFavourite();
        }
      ).then(function (isFavouriteRestaurant) {
          $scope.isFavourite = isFavouriteRestaurant;
        });
    }

    function openAddToListModal() {
      if ($scope.modal) {
        return $q.when($scope.modal);
      } else {
        return $ionicModal.fromTemplateUrl('templates/add_to_list_popup.html', {
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
        templateUrl: 'templates/favourites_popup.html',
        hideOnStateChange: true,
        noBackdrop: true,
        duration: 2500
      });
    }

    function errorMsgPopover() {
      $ionicLoading.show({
        templateUrl: 'templates/error_msg_list_popup.html',
        hideOnStateChange: true,
        noBackdrop: true,
        duration: 2500
      });
    }

    function recordHistory(params) {
      ViewedHistory.record(Parse.User.current().id, {
        foursquareId : params.venueId,
        cardId : params.card ? card.id : undefined
      });
    }
  };

  angular.module('kiwii').
    controller('DetailsCtrl', DetailsCtrl);
})();
