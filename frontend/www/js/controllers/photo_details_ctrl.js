(function() {
    var PhotoDetailsCtrl = function($scope, $state, PhotoDetails, RestaurantDetails) {

        loadPhotoData();

        $scope.restaurantDetails = function (foursquareId) {
			// TODO: Pass venue ID through state parameters instead
			 $state.go('tab.details', {venueId: foursquareId});
		};

        function loadPhotoData() {
            var photo = PhotoDetails.getPhotoDetails();
            var Restaurants = Parse.Object.extend('Restaurants');
            var restaurant = new Parse.Query(Restaurants);
            restaurant.get(photo.attributes.restaurant.id)
                .then(function (result) {
                    $scope.photoData = photo;
                    $scope.photoData['attributes']['restaurant']['attributes'] = result.attributes;
                    console.log($scope.photoData);
                }, function (error) {
                    console.log(error);
                });
        }
    };

    angular.module('kiwii')
        .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)
})();
