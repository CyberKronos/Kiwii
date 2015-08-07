(function () {
    var DetailsCtrl = function ($scope, $state, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicModal, $cordovaInAppBrowser, $cordovaStatusbar, RestaurantPreference, RestaurantDetails, Lists) {

        if (window.cordova) { 
          $cordovaStatusbar.style(0);
        }

        var restaurantPreference = null;
        getRestaurantInfo();

        var userLists = Parse.User.current().relation('lists');
        userLists.query().find()
            .then(function(lists) {
                $scope.userLists = lists;
                console.log($scope.userLists);
                $scope.$digest();
            });

        $ionicModal.fromTemplateUrl('templates/add_to_list_popup.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });  

        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });

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
            $state.go('tab.maps');
        };

        $scope.addToList = function () {
            $scope.openModal();
        };

        $scope.saveToList = function (list) {
            if (list == 'saveForLater') {
                restaurantPreference.set(!$scope.isFavourite)
                    .then(function () {
                        $scope.isFavourite = !$scope.isFavourite;
                        if ($scope.isFavourite) {
                            $scope.closeModal();
                            createPopover();
                        }
                    });
            } else {
                Lists.saveRestaurantListRelation(list, $scope.restaurantDetails.id)
                    .then(function() {
                        $scope.closeModal();
                        createPopover();
                    });
            }
        };

        // $scope.toggleFavourite = function ($event) {
        //     restaurantPreference.set(!$scope.isFavourite)
        //         .then(function () {
        //             $scope.isFavourite = !$scope.isFavourite;
        //             if ($scope.isFavourite) {
        //                 createPopover();
        //             }
        //         });
        // };

        function getRestaurantInfo() {
            RestaurantDetails.fetchVenue().then(
                function (result) {
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
