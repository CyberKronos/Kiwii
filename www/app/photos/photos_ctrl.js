(function () {
  var PhotosCtrl = function ($scope, $state, $stateParams, $ionicActionSheet, $ionicLoading, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, $cordovaInAppBrowser, FoursquareApi, Cards, RestaurantDetails) {

    loadPhotoData();

    $scope.zoomMin = 1;

    $scope.showImages = function(index) {
      
      $scope.activeSlide = index;
      $scope.showModal('app/photos/photos_zoomview.html');
    };

    $scope.showModal = function(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }
     
    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove()
    };
     
    $scope.updateSlideStatus = function(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    function loadPhotoData() {
    	var photos = $stateParams.photos;
    	var venueId = $stateParams.venueId;
      console.log($stateParams);
    	if (photos != null) {
    		return $scope.instagramImages = $stateParams.photos;
    	} else {
    		showLoading();
    		return RestaurantDetails.fetchVenue(venueId)
	        	.then(function (result) {
	        		hideLoading();
	        		return $scope.instagramImages = result.images;
	        	});
    	}
    }

    function showLoading() {
      $scope.isLoading = true;
      $ionicLoading.show({
        template: 'Loading Photos...'
      });
    }

    function hideLoading() {
      $scope.isLoading = false;
      $ionicLoading.hide();
    }
  };

  angular.module('kiwii')
    .controller('PhotosCtrl', PhotosCtrl)
})();