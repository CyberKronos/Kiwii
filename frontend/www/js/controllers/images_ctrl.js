(function () {
  var ImagesCtrl = function ($scope, $state, $cordovaCamera, $cordovaStatusbar, $ionicModal, $ionicLoading, UserPhotos) {
    if (window.cordova) { 
      $cordovaStatusbar.style(1);
    }

    $scope.imagePost = {};

    $ionicModal.fromTemplateUrl('templates/edit_image_popup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });  

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.uploadImage = function(source) {
      var options = { 
        quality : 100, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : (source == 'CAMERA') ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 600,
        targetHeight: 600,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options)
      .then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.imagePost['imageData'] = "data:image/jpeg;base64," + imageData;
        $scope.openModal();
      });
    };

    $scope.postPhoto = function() {
      showLoading();
      UserPhotos.savePhoto($scope.imagePost)
      .then(function(success){
        console.log(success);
        hideLoading();
        $scope.closeModal();
        $state.go('tab.profile');
      }, function(error) {
        console.log(error);
      });
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
  };

  angular.module('kiwii').
    controller('ImagesCtrl', ImagesCtrl);
})();
