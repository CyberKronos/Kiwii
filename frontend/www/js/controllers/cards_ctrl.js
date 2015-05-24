(function () {
    var CardsCtrl = function ($rootScope, $scope, $state, InstagramApi, FoursquareApi, RestaurantDetails, ImagePreloader) {

        var previousRestuarants = [];

        fetchRestaurants($rootScope.searchCriteria)
            .then(preloadRestaurantPhotos);

        $scope.dismissShow = function (show) {
            var i = $scope.restuarants.indexOf(show);
            $scope.dislikedShow(i);
            $scope.destroyShow(i);
        };

        $scope.saveShow = function (show) {
            var i = $scope.restuarants.indexOf(show);
            $scope.likedShow(i);
            $scope.destroyShow(i);
        };

        /* Card callbacks from swiping */
        //$scope.destroyRestuarant = function (index) {
        //    $scope.restuarants.splice(index, 1);
        //    console.log($scope.restuarants);
        //};

        $scope.nextRestuarant = function (index) {
            console.log('Swiped Left');
            previousRestuarants.push($scope.restuarants[index]);
            $scope.restuarants.splice(index, 1);
            console.log($scope.restuarants);
            console.log(previousRestuarants);
            if ($scope.restuarants <= 0) {
                $state.go('dash');
            }
        };

        $scope.prevRestuarant = function (index) {
            console.log('Swiped Right');
            if (previousRestuarants.length > 0) {
                var lastRestuarant = previousRestuarants.pop();
                console.log(lastRestuarant);
                $scope.restuarants.splice(index, 0, lastRestuarant);
            } else {
                $state.go('dash');
            }
            console.log($scope.restuarants);
            console.log(previousRestuarants);
        };

        $scope.restaurantDetails = function (restaurant) {
            // TODO: Pass venue ID through state parameters instead
            RestaurantDetails.setVenueId(restaurant.foursquareId);
            $state.go('details');
        };

        function fetchRestaurants(searchCriteria) {
            return FoursquareApi.exploreRestaurants(searchCriteria)
                .then(function (response) {
                    $scope.restuarants = response;
                    $scope.$digest();   // Can't figure out how to get cards display consistently without manually calling digest cycle.
                    return $scope.restuarants;
                });
        }

        function preloadRestaurantPhotos(restaurants) {
            return ImagePreloader.preloadImages(_.map(restaurants, function (r) {
                return r['imageUrl'];
            }));
        }
    };

    angular.module('app').
        controller('CardsCtrl', CardsCtrl);
})();
