(function () {
    var DashCtrl = function ($scope, $rootScope, $ionicSideMenuDelegate, $state, $ionicHistory, $cordovaGeolocation) {

        $scope.isLoadingLocation = true;

        fetchCurrentLocation()
            .then(function() {
                $scope.isLoadingLocation = false;
            });

        // TODO: Use constant service
        var DISTANCE_LABELS = [
            {text: 'Off the Beaten Path', minDistance: 20000, icon: 'ion-android-compass'},
            {text: 'Driving Distance', minDistance: 8000, icon: 'ion-android-car'},
            {text: 'Biking Distance', minDistance: 4000, icon: 'ion-android-bicycle'},
            {text: 'Walking Distance', minDistance: 2000, icon: 'ion-android-walk'},
            {text: 'Within a Few Blocks', minDistance: 0, icon: 'ion-android-pin'}
        ];

        $scope.distanceLabel = DISTANCE_LABELS[3];

        $scope.cuisineList = [
            { type: 'All Cuisines', name: '', id: '' },
            { type: 'American', name: 'American Restaurants', id: '4bf58dd8d48988d14e941735' },
            { type: 'Asian', name: 'Asian Restaurants', id: '4bf58dd8d48988d142941735' },
            { type: 'Bakery', name: 'Bakery', id: '4bf58dd8d48988d16a941735' },
            { type: 'Bistro', name: 'Bistro', id: '52e81612bcbc57f1066b79f1' },
            { type: 'Breakfast Spots', name: 'Breakfast Spots', id: '4bf58dd8d48988d143941735' },
            { type: 'Burger Joint', name: 'Burger Joint', id: '4bf58dd8d48988d16c941735' },
            { type: 'Cafe', name: 'Cafe', id: '4bf58dd8d48988d16d941735' },
            { type: 'Chinese', name: 'Chinese Restaurants', id: '4bf58dd8d48988d145941735' },
            { type: 'French', name: 'French Restaurants', id: '4bf58dd8d48988d10c941735' },
            { type: 'Greek', name: 'Greek Restaurants', id: '4bf58dd8d48988d10e941735' },
            { type: 'Indian', name: 'Indian Restaurants', id: '4bf58dd8d48988d10f941735' },
            { type: 'Italian', name: 'Italian Restaurants', id: '4bf58dd8d48988d110941735' },
            { type: 'Japanese', name: 'Japanese Restaurants', id: '4bf58dd8d48988d111941735' },
            { type: 'Korean', name: 'Korean Restaurants', id: '4bf58dd8d48988d113941735' },
            { type: 'Malaysian', name: 'Malaysian Restaurants', id: '4bf58dd8d48988d156941735' },
            { type: 'Mexican', name: 'Mexican Restaurants Restaurants', id: '4bf58dd8d48988d1c1941735' },
            { type: 'Middle Eastern', name: 'Middle Eastern Restaurants', id: '4bf58dd8d48988d115941735' },
            { type: 'Seafood', name: 'Seafood Restaurants', id: '4bf58dd8d48988d1ce941735' },
            { type: 'Southern / Soul', name: 'Southern / Soul Food Restaurants', id: '4bf58dd8d48988d14f941735' },
            { type: 'Spanish', name: 'Spanish Restaurants', id: '4bf58dd8d48988d150941735' },
            { type: 'Turkish', name: 'Turkish Restaurants', id: '4f04af1f2fb6e1c99f3db0bb' },
            { type: 'Vegetarian / Vegan', name: 'Vegetarian / Vegan Restaurants', id: '4bf58dd8d48988d1d3941735' },
            { type: 'Vietnamese', name: 'Vietnamese Restaurants', id: '4bf58dd8d48988d14a941735' }
        ];

        $scope.priceList = [
            {text: '$', value: '1'},
            {text: '$$', value: '2'},
            {text: '$$$', value: '3'},
            {text: '$$$$', value: '4'}
        ];

        $scope.openNow = {
            text: 'Open restaurants only', 
            checked: true
        };

        $scope.criteria = {
            radius: 2000,
            price: '1,2,3,4',
            query: $scope.cuisineList[0]['name'],
            openNow: 1
        };

        $scope.data = {};

        $rootScope.searchCriteria = $scope.criteria;

        $scope.updateDistanceLabel = function (distance) {
            var i;
            for (i = 0; i < DISTANCE_LABELS.length; i++) {
                if (distance >= DISTANCE_LABELS[i].minDistance) {
                    $scope.distanceLabel = DISTANCE_LABELS[i];
                    $scope.$digest();
                }
            }
        };

        $scope.updateOpenNowValue = function() {
            $scope.criteria.openNow = ($scope.openNow.checked == true ? 1 : 0);
            console.log($rootScope.searchCriteria);
        };

        $scope.logCuisine = function() {
            console.log($rootScope.searchCriteria);
        };

        $scope.searchRestaurants = function () {
            $rootScope.cardTitle = '';
            $rootScope.cuisineType = $scope.criteria.query;
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

        $scope.updateLocation = function() {
            $scope.isLoadingLocation = false;
        };

        function fetchCurrentLocation() {
            // Geolocation to get location position
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            return $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    $rootScope.searchCriteria['ll'] = lat + ',' + long;
                    console.log($rootScope.searchCriteria);
                }, function (err) {
                    // error
                    console.log("Error retrieving position " + err.code + " " + err.message)
                });
        }
    };

    angular.module('kiwii').
        controller('DashCtrl', DashCtrl);
})();
