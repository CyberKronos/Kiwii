(function () {
    var DetailsCtrl = function ($rootScope, $scope, $state, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaInAppBrowser, RestaurantPreference, RestaurantDetails) {

        var restaurantPreference = null;
        getRestaurantInfo();

        $scope.openWebsite = function (link) {
            var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'no'
              // toolbarposition: 'top'
            };

            // to change window to $cordovaInAppBrowser to get options
            // but it will break
            $cordovaInAppBrowser.open(link, '_blank', options);
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
                    $rootScope.latlon = result.details.location;
                    $scope.restaurantDetails = result.details;
                    $scope.instagramImages = result.images;
                    $scope.restaurantReviews = result.reviews;
                }
            ).then(function () {
                    restaurantPreference = new RestaurantPreference(Parse.User.current(), $scope.restaurantDetails.id);
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

    angular.module('kiwii').
        controller('DetailsCtrl', DetailsCtrl);
})();
