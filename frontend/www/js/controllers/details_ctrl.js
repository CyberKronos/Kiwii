(function () {
    var DetailsCtrl = function ($rootScope, $scope, $state, $timeout, $ionicPopover, RestuarantPreference, RestaurantDetails) {

        $scope.navSlide = function (index) {
            $ionicSlideBoxDelegate.slide(index, 500);
        };

        $scope.openWebsite = function (link) {
            window.open(link, '_blank', 'location=yes');
        };

        var restuarantPreference = null;

        $scope.toggleFavourite = function ($event) {
            restuarantPreference.toggle()
                .then(function (isFavourite) {
                    $scope.isFavourite = isFavourite;

                    // TODO: Consider using https://github.com/rafbgarcia/angular-parse-wrapper
                    $scope.$digest();
                    if (isFavourite) {
                        $scope.popover.show($event);
                    }
                });
        };

        $scope.popover = $ionicPopover.fromTemplateUrl('templates/favourites_popup.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });

        RestaurantDetails.fetchFor().then(
            function (result) {
                // TODO: refactor restaurant lat/long into a service
                $rootScope.restaurantDetails = result.details;
                $scope.instagramImages = result.images;
                $scope.restaurantReviews = result.reviews;
            }
        ).then(function () {
                restuarantPreference = new RestuarantPreference(Parse.User.current(), $rootScope.restaurantDetails.id);
                return restuarantPreference.isFavourite();
            }
        ).then(function (isFavourite) {
                $scope.isFavourite = isFavourite;
            });

        $scope.goToMaps = function() {
            $state.go('maps');
        };
    };

    angular.module('app').
        controller('DetailsCtrl', DetailsCtrl);
})();
