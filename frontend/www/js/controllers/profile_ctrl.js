(function() {
    var ProfileCtrl = function($scope, $state, $cordovaStatusbar, RestaurantDetails, RestaurantPreference) {
        if (window.cordova) { 
          $cordovaStatusbar.style(1);
        }

        var savedRestaurants = Parse.User.current().relation('savedRestaurants');
        savedRestaurants.query().collection().fetch()
            .then(function(restaurants) {
                $scope.favouritesList = restaurants.toJSON();
                $scope.$digest();
            });

        $scope.removeRestaurant = function(index, restaurant) {
            $scope.favouritesList.splice(index, 1);
            var preference = new RestaurantPreference(Parse.User.current(), restaurant.foursquareId);
            preference.set(false)
                .then(function() {
                    console.log('Removed');
                });
        };

        $scope.goToDetails = function(restaurant) {
            RestaurantDetails.setVenueId(restaurant.foursquareId);
            $state.go('tab.details');
        };
    };

    angular.module('kiwii')
        .controller('ProfileCtrl', ProfileCtrl)
})();
