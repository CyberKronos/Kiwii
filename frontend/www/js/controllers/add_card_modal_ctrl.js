(function () {
  var AddCardModalCtrl = function ($scope, $state, $ionicLoading, $ionicPopup, $ionicActionSheet,
                                   parameters, Cards, CameraService, RestaurantExplorer, LocationService) {

    fetchCurrentLocation();
    $scope.userPhotos = [];
    if (parameters) {
      $scope.userPhotos = parameters.images || [];
      $scope.taggedRestaurant = parameters.taggedRestaurant;
    }

    $scope.postPhoto = function () {
      showLoading();

      _.forEach($scope.userPhotos, function (userPhoto) {
        userPhoto['foursquareId'] = $scope.taggedRestaurant.foursquareId;
      });

      Cards.createCard({
          userPhotos: $scope.userPhotos,
          author: Parse.User.current(),
          taggedRestaurant: $scope.userPhotos[0].foursquareId
        }
      )
        .then(function () {
          hideLoading();
          $scope.closeModal();
          $state.go('tab.profile');
        })
        .catch(function (error) {
          hideLoading();
          $ionicPopup.alert({
            title: 'Posting Error',
            template: error,
            buttons: [
              {
                text: 'Ok',
                type: 'button-assertive'
              }
            ]
          });
        })
        .finally(hideLoading);
    };

    $scope.openAddPhotoActionSheet = function () {
      // Show the action sheet
      $ionicActionSheet.show({
        buttons: [
          {text: 'Photo Library', actionType: CameraService.PictureSourceType.PHOTOLIBRARY},
          {text: 'Take Photo', actionType: CameraService.PictureSourceType.CAMERA}
        ],
        titleText: 'Add a photo',
        cancelText: 'Cancel',
        buttonClicked: function (index, button) {
          CameraService.getPicture(button.actionType)
            .then(function (imageData) {
              $scope.userPhotos.push({
                imageData : 'data:image/jpeg;base64,' + imageData
              })
            });
          return true;
        }
      });
    };

    $scope.getRestaurants = function (query) {
      if (!query) {
        return {};
      }
      return RestaurantExplorer.findWithKiwii({
        'query': query,
        'll': $scope.latlng,
        'radius': 50000,
        'limit': 10
      })
        .then(function (restaurants) {
          return {
            items: restaurants
          };
        });
    };

    $scope.restaurantsClicked = function (callback) {
      $scope.taggedRestaurant = callback.item;
      console.log($scope.taggedRestaurant);
    };

    function showLoading() {
      $scope.isLoading = true;
      $ionicLoading.show({
        template: 'Posting photo...'
      });
    }

    function hideLoading() {
      $scope.isLoading = false;
      $ionicLoading.hide();
    }

    function fetchCurrentLocation() {
      LocationService.fetchCurrentLocation()
        .then(function (latLng) {
          $scope.latlng = latLng.lat + ',' + latLng.lng;
        }, function (err) {
          // error
          var confirmPopup = $ionicPopup.confirm({
            title: 'Location Error',
            template: "Error retrieving position. Check your connection and location settings?",
            buttons: [
              {
                text: 'Cancel'
              },
              {
                text: 'Ok',
                type: 'button-assertive'
              }
            ]
          });
        });
    }
  };
  angular.module('kiwii').
    controller('AddCardModalCtrl', AddCardModalCtrl);
})();
