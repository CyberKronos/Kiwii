(function () {
    var CardsCtrl = function ($rootScope, $scope, $state, InstagramApi, FoursquareApi) {

        var previousRestuarants = [];

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

        $scope.restaurantDetails = function (restuarant) {
            FoursquareApi.getRestaurantDetails(restuarant.foursquareId)
                .then(function (details) {
                    $rootScope.restaurantDetails = details;
                });

            InstagramApi.getLocationImages(restuarant.foursquareId)
                .then(function (images) {
                    $rootScope.instagramImages = images;
                });

            FoursquareApi.getRestaurantReviews(restuarant.foursquareId)
                .then(function (tips) {
                    $rootScope.restaurantReviews = tips;
                });

            $state.go('details');
        };

        FoursquareApi.exploreRestaurants($rootScope.searchCriteria)
            .then(function (response) {
                $scope.restuarants = response;
                $scope.$digest();   // Can't figure out how to get cards display consistently without manually calling digest cycle.
            });
    };

    angular.module('app').
        controller('CardsCtrl', CardsCtrl);
})();
