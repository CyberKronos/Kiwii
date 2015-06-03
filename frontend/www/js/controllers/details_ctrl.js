(function () {
    var DetailsCtrl = function ($rootScope, $scope, $state, $ionicLoading, RestaurantPreference, RestaurantDetails) {

        var restaurantPreference = null;
        getRestaurantInfo();

        $scope.navSlide = function (index) {
            $ionicSlideBoxDelegate.slide(index, 500);
        };

        $scope.openWebsite = function (link) {
            window.open(link, '_blank', 'location=yes');
        };

        $scope.goToMaps = function () {
            $state.go('maps');
        };

        $scope.toggleFavourite = function ($event) {
            restaurantPreference.set(!$scope.isFavourite)
                .then(function () {
                    $scope.isFavourite = !$scope.isFavourite;
                    if ($scope.isFavourite) {
                        createPopover();
                    }
                });
        };

        function getRestaurantInfo() {
            RestaurantDetails.fetchFor().then(
                function (result) {
                    // TODO: refactor restaurant lat/long into a service
                    $rootScope.restaurantDetails = result.details;
                    $scope.instagramImages = result.images;
                    $scope.restaurantReviews = result.reviews;
                }
            ).then(function () {
                    restaurantPreference = new RestaurantPreference(Parse.User.current(), $rootScope.restaurantDetails.id);
                    return restaurantPreference.isFavourite();
                }
            ).then(function (isFavouriteRestaurant) {
                    $scope.isFavourite = isFavouriteRestaurant;
                });
        }

        function createPopover() {
            $ionicLoading.show({
                templateUrl: 'templates/favourites_popup.html',
                hideOnStateChange: true,
                noBackdrop: true,
                duration: 2500
            });
        }
    };

    angular.module('app').
        controller('DetailsCtrl', DetailsCtrl);
})();
