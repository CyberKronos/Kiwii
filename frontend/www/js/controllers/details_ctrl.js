(function () {
    var DetailsCtrl = function ($rootScope, $scope, $state, $timeout, $ionicPopover, RestaurantPreference, RestaurantDetails) {

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

        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });

        $scope.$on('$stateChangeStart', function () {
            $scope.popover.remove();
        });

        $scope.toggleFavourite = function ($event) {
            restaurantPreference.set(!$scope.isFavourite)
                .then(function () {
                    $scope.isFavourite = !$scope.isFavourite;
                    $scope.$digest();
                    if ($scope.isFavourite) {
                        createPopover($event);
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

        function createPopover($event) {
            $ionicPopover.fromTemplateUrl('templates/favourites_popup.html', {
                scope: $scope
            })
                .then(function (popover) {
                    $scope.popover = popover;
                    $scope.popover.show($event);
                })
        }
    };

    angular.module('app').
        controller('DetailsCtrl', DetailsCtrl);
})();
