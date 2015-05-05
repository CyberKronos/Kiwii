(function () {
    var CardsCtrl = function ($rootScope, $scope, $state, InstagramApi, FoursquareApi) {

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
        $scope.destroyShow = function (index) {
            $scope.restuarants.splice(index, 1);
            console.log($scope.restuarants);
        };

        $scope.dislikedShow = function (index) {
            //Actions.dislikeShow($scope.shows[index].id);
        };

        $scope.likedShow = function (index) {
            //Actions.likeShow($scope.shows[index].id);
        };

        $scope.restaurantDetails = function (restuarant) {
            InstagramApi.getLocationImages(restuarant.foursquareId);
            FoursquareApi.getRestaurantReviews(restuarant.foursquareId);

            $state.go('details');
        };

        FoursquareApi.exploreRestaurants($rootScope.searchCriteria).then(
            function (response) {
                $scope.restuarants = response;
                $scope.$digest();   // Can't figure out how to get cards display consistently without manually calling digest cycle.
            });
    };

    angular.module('app').
        controller('CardsCtrl', CardsCtrl);
})();
