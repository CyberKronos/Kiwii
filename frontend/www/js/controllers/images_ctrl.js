(function () {
  var ImagesCtrl = function ($scope, $localStorage, $state, $cordovaCamera, $cordovaStatusbar, $ionicModal, $ionicLoading, $ionicPopup,
                             Cards, RestaurantExplorer, LocationService, AppModalService) {

    $scope.imagePost = {};

    $scope.openModal = function () {
      AppModalService.show('templates/edit_image_popup.html', 'AddCardModalCtrl',
        {images: [$scope.imagePost]})
    };

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
    };
  };

  angular.module('kiwii').
    controller('ImagesCtrl', ImagesCtrl);
})();
