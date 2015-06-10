(function () {
    var DashCtrl = function ($scope, $rootScope, $ionicSideMenuDelegate, $state, $ionicHistory, $cordovaGeolocation, CRITERIA_OPTIONS, CRITERIA_DEFAULTS) {

        fetchCurrentLocation();

        $scope.cuisineList = CRITERIA_OPTIONS.CUISINE_TYPES;

        $scope.priceList = CRITERIA_OPTIONS.PRICES;

        $scope.criteria = {
            radius: CRITERIA_DEFAULTS.DISTANCE,
            price: CRITERIA_DEFAULTS.PRICES,
            query: CRITERIA_OPTIONS.CUISINE_TYPES[0]['name']
        };

        $scope.distanceLabel = getDistanceLabel($scope.criteria.radius);

        $scope.data = {};

        $rootScope.searchCriteria = $scope.criteria;

        $scope.updateDistanceLabel = function (distance) {
            $scope.distanceLabel = getDistanceLabel(distance);
            $scope.$digest();
        };

        $scope.searchRestaurants = function () {
            $rootScope.cardTitle = '';
            $rootScope.cuisineType = '';
            if ($scope.data.location) {
                console.log($scope.data.location);
                var latlng = $scope.data.location.geometry.location;
                console.log(latlng);
                $scope.criteria.ll = latlng.lat() + ',' + latlng.lng();
            }
            $state.go('cards');
        };

        $scope.topTenRestaurants = function () {
            $state.go('topten');
        };

        $scope.selectCuisinesPopup = function () {
            console.log($ionicHistory.viewHistory());
        };

        function getDistanceLabel(distance) {
            var labels = CRITERIA_OPTIONS.DISTANCE_LABELS;
            var i;
            for (i = 0; i < labels.length; i++) {
                if (distance >= labels[i].minDistance) {
                    return labels[i];
                }
            }
        }

        function fetchCurrentLocation() {
            // Geolocation to get location position
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            return $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    $rootScope.searchCriteria['ll'] = lat + ',' + long;
                }, function (err) {
                    // error
                    console.log("Error retrieving position " + err.code + " " + err.message)
                });
        }
    };

    angular.module('kiwii').
        controller('DashCtrl', DashCtrl);
})();
