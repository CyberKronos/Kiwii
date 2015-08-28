(function () {
  var ImagesCtrl = function ($scope, $localStorage, $state, $cordovaCamera, $cordovaStatusbar, $ionicModal, $ionicLoading, $ionicPopup, UserPhotos, RestaurantExplorer, LocationService) {

    fetchCurrentLocation();

    $scope.imagePost = {};

    $ionicModal.fromTemplateUrl('templates/edit_image_popup.html', {
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

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.uploadImage = function (source) {
      if (!Camera) {
        $scope.imgURI = "data:image/jpeg;base64";
        $scope.imagePost['imageData'] = "data:image/jpeg;base64";
        $scope.openModal();
        return;
      }

      $scope.imagePost = {};
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: (source == 'CAMERA') ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 600,
        targetHeight: 600,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options)
        .then(function (imageData) {
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
          $scope.imagePost['imageData'] = "data:image/jpeg;base64," + imageData;
          $scope.openModal();
        });
      // $scope.openModal();
    };

    $scope.postPhoto = function () {
      showLoading();
      UserPhotos.savePhoto($scope.imagePost)
        .then(function (success) {
          console.log(success);
          hideLoading();
          $scope.closeModal();
          $state.go('tab.profile');
        }, function (error) {
          hideLoading();
          console.log(error);
          var confirmPopup = $ionicPopup.confirm({
            title: 'Posting Error',
            template: error,
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
      $scope.imagePost['foursquareId'] = callback.item.foursquareId;
      console.log($scope.imagePost);
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
    controller('ImagesCtrl', ImagesCtrl);
})();
