(function () {
  var ImagesCtrl = function ($scope, $localStorage, $state, $cordovaCamera, $cordovaStatusbar, $ionicModal, $ionicLoading, $ionicPopup,
                             Cards, RestaurantExplorer, CameraService, LocationService, AppModalService) {

    $scope.imagePost = {};

    $scope.openModal = function () {
      AppModalService.show('templates/edit_image_popup.html', 'AddCardModalCtrl',
        {images: [$scope.imagePost]})
    };

    $scope.uploadImage = function (source) {
      var sourceType = source === 'CAMERA' ? CameraService.PictureSourceType.CAMERA
        : CameraService.PictureSourceType.PHOTOLIBRARY;

      CameraService.getPicture(sourceType)
        .then(function (imageData) {
          $scope.imagePost['imageData'] = "data:image/jpeg;base64," + imageData;
          $scope.openModal();
        });
    };
  };

  angular.module('kiwii').
    controller('ImagesCtrl', ImagesCtrl);
})();
