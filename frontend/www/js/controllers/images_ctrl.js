(function () {
  var ImagesCtrl = function ($scope, $localStorage, $state, $cordovaCamera, $cordovaStatusbar, $ionicModal, $ionicLoading, UserPhotos) {

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
      $scope.imagePost = {};
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

     $scope.getRestaurants = function (query) {
      var searchItems = $localStorage.searchRestaurantItems;
      var returnValue = { items: [] };
      searchItems.forEach(function(item){
          if (item.name.toLowerCase().indexOf(query) > -1 ){
              returnValue.items.push(item);
          }
          else if (item.foursquareId.toLowerCase().indexOf(query) > -1 ){
          returnValue.items.push(item);
          }
      });
      return returnValue;
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
  };

  angular.module('kiwii').
    controller('ImagesCtrl', ImagesCtrl);
})();
