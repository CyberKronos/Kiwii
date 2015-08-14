(function() {
    var PhotoDetailsCtrl = function($scope, $state, PhotoDetails, RestaurantDetails) {
        
        loadPhotoData();

        $scope.restaurantDetails = function (foursquareId) {
			// TODO: Pass venue ID through state parameters instead
			RestaurantDetails.setVenueId(foursquareId);
			// AnalyticsTracking.explorerSelectedVenue(restaurant.foursquareId);
			$state.go('tab.details');
		};

        function loadPhotoData() {
            $scope.photoData = PhotoDetails.getPhotoDetails();

            var taggedRestaurant = $scope.photoData.relation('restaurant');
	        return taggedRestaurant.query().collection().fetch()
	            .then(function(restaurant) {
	                $scope.taggedRestaurant = restaurant.toJSON();
	                console.log($scope.taggedRestaurant[0]);
	                $scope.$digest();
	            });
        }
    };

    angular.module('kiwii')
        .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)
})();
