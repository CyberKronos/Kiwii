(function () {
  var PhotosCtrl = function ($scope, $state, $stateParams, $ionicActionSheet, $ionicLoading, $cordovaInAppBrowser, FoursquareApi, Cards, RestaurantDetails) {

    loadPhotoData();

    function loadPhotoData() {
    	var photos = $stateParams.photos;
    	var venueId = $stateParams.venueId;
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