(function() {
    var ListsCtrl = function($scope, $state, RestaurantDetails, RestaurantPreference, ListDetails) {
        loadListData();

        $scope.removeRestaurant = function(index, restaurant) {
            if ($scope.listData.name == 'Save for Later') {
                $scope.favouritesList.splice(index, 1);
                var preference = new RestaurantPreference(Parse.User.current(), restaurant.foursquareId);
                preference.set(false)
                    .then(function() {
                        console.log('Removed');
                    });
            } else {
                console.log('to remove!');
            }     
        };

        $scope.goToDetails = function(restaurant) {
            RestaurantDetails.setVenueId(restaurant.foursquareId);
            $state.go('tab.details');
        };

        function loadListData() {
            $scope.listData = ListDetails.getListDetails();

            if ($scope.listData.name == 'Save for Later') {
                var savedRestaurants = Parse.User.current().relation('savedRestaurants');
                return savedRestaurants.query().collection().fetch()
                    .then(function(restaurants) {
                        $scope.favouritesList = restaurants.toJSON();
                        $scope.$digest();
                    });
            } else {
                var restaurants = $scope.listData.relation('restaurants');
                return restaurants.query().collection().fetch()
                    .then(function(restaurants) {
                        $scope.restaurantList = restaurants.toJSON();
                        $scope.$digest();
                    });
            }
        }
    };

    angular.module('kiwii')
        .controller('ListsCtrl', ListsCtrl)
})();
