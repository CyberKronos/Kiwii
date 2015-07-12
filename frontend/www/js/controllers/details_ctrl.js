(function () {
    var DetailsCtrl = function ($scope, $state, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $cordovaInAppBrowser, $cordovaStatusbar, RestaurantPreference, RestaurantDetails) {

        if (window.cordova) { 
          $cordovaStatusbar.style(0);
        }

        var restaurantPreference = null;
        getRestaurantInfo();

        $scope.openWebsite = function (link) {
            var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'yes'
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
            RestaurantDetails.fetchVenue().then(
                function (result) {
                    // TODO: refactor restaurant lat/long into a service
                    $scope.restaurantDetails = result.details;
                    $scope.instagramImages = result.images;
                    $scope.restaurantReviews = result.reviews;
                }
            ).then(function () {
                    restaurantPreference = new RestaurantPreference(Parse.User.current(), RestaurantDetails.getVenueId());
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
