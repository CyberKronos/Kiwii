(function () {
    var CardsCtrl = function ($scope, $state, InstagramApi, FoursquareApi) {
        // $scope.sideMenuIsOpen = function() {
        //   return $ionicSideMenuDelegate.isOpenLeft();
        // }

        $scope.dismissShow = function (show) {
            var i = $scope.shows.indexOf(show);
            $scope.dislikedShow(i);
            $scope.destroyShow(i);
        }

        $scope.saveShow = function (show) {
            var i = $scope.shows.indexOf(show);
            $scope.likedShow(i);
            $scope.destroyShow(i);
        }

        /* Card callbacks from swiping */
        $scope.destroyShow = function (index) {
            $scope.shows.splice(index, 1);
            //if ($scope.shows.length <= 3 && !$scope.fetchInProgress) {
            //    $scope.fetchInProgress = true;
            //    $scope.appendShows = true;
            //    //Actions.fetchShows();
            //}
        }

        $scope.dislikedShow = function (index) {
            //Actions.dislikeShow($scope.shows[index].id);
        }

        $scope.likedShow = function (index) {
            //Actions.likeShow($scope.shows[index].id);
        }

        /* Initialize the state */
        //Store.bindState($scope, function (action) {
        //    if (action && action.actionType == AppConstants.FETCH_SHOWS) {
        //        if (action.response == ApiConstants.PENDING) {
        //            $scope.fetchInProgress = true;
        //        } else {
        //            $scope.updateShows(Store.getShows());
        //            $scope.fetchInProgress = false;
        //        }
        //    }
        //});

        // Ensures that we don't have any duplicate shows
        //$scope.updateShows = function (shows) {
        //    if ($scope.appendShows) {
        //        $scope.shows = _.union($scope.shows, shows);
        //        $scope.shows = _.uniq($scope.shows, false, function (show) {
        //            return show.id;
        //        });
        //    } else {
        //        $scope.shows = shows;
        //    }
        //}

        $scope.restaurantDetails = function () {
            var foursquareId = '4e5eb1e61fc724eac4c172e0';

            InstagramApi.getLocationImages(foursquareId);
            FoursquareApi.getRestaurantReviews(foursquareId);

            $state.go('details');
        };

        FoursquareApi.exploreRestaurants().then(
            function (response) {
                $scope.shows = response;
                console.log($scope.shows);
                $scope.$digest();   // Can't figure out how to get cards display consistently without manually calling digest cycle.
            });
    };

    angular.module('app').
        controller('CardsCtrl', CardsCtrl);
})();
