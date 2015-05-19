(function() {
    var ProfileCtrl = function($scope) {
        var savedRestaurants = Parse.User.current().relation('savedRestaurants');
        savedRestaurants.query().collection().fetch()
            .then(function(restaurants) {
                $scope.favouritesList = restaurants.toJSON();
                $scope.$digest();
            });

        $scope.removeRestaurant = function(index) {
            $scope.favouritesList.splice(index, 1);
        };
    };

    angular.module('app')
        .controller('ProfileCtrl', ProfileCtrl)
})();
