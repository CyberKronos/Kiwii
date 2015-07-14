(function () {
  var ImagesCtrl = function ($scope, $cordovaCamera, $ionicModal) {
    $scope.imagePost = {
      name: 'Restaurant Name',
      description: 'Image description...',
    }

    $ionicModal.fromTemplateUrl('templates/edit_image_popup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal
    })  

    $scope.openModal = function() {
      $scope.modal.show()
    }

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.takePicture = function() {
      var options = { 
        quality : 100, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 400,
        targetHeight: 400,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.openModal();
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

    $scope.choosePicture = function() {
      var options = { 
        quality : 100, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 400,
        targetHeight: 400,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.openModal();
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }

  };

  angular.module('kiwii').
    controller('ImagesCtrl', ImagesCtrl);
})();
