(function () {
    var DashCtrl = function ($scope, $rootScope, $ionicSideMenuDelegate, $state, $ionicHistory) {

        console.log($ionicHistory.currentView());

        // TODO: Use constant service
        var DISTANCE_LABELS = [
            {text: 'Off the Beaten Path', minDistance: 15000, icon: 'ion-android-compass'},
            {text: 'Driving Distance', minDistance: 8000, icon: 'ion-android-car'},
            {text: 'Biking Distance', minDistance: 4000, icon: 'ion-android-bicycle'},
            {text: 'Walking Distance', minDistance: 2000, icon: 'ion-android-walk'},
            {text: 'Within a Few Blocks', minDistance: 0, icon: 'ion-android-pin'}
        ];

        $scope.distanceLabel = DISTANCE_LABELS[3];

        $scope.cuisineList = [
            { type: "All Cuisines" },
            { type: "American" },
            { type: "Asian" },
            { type: "Bakery" },
            { type: "Bistro" },
            { type: "Breakfast Spots" },
            { type: "Burger Joint" },
            { type: "Cafe" },
            { type: "Chinese" },
            { type: "French" },
            { type: "Greek" },
            { type: "Indian" },
            { type: "Italian" },
            { type: "Japanese" },
            { type: "Korean" },
            { type: "Malaysian" },
            { type: "Mexican" },
            { type: "Middle Eastern" },
            { type: "Southern / Soul" },
            { type: "Spanish" },
            { type: "Turkish" },
            { type: "Vegetarian / Vegan" },
            { type: "Vietnamese" }
        ];

        $scope.priceList = [
            {text: '$', value: '1'},
            {text: '$$', value: '2'},
            {text: '$$$', value: '3'},
            {text: '$$$$', value: '4'}
        ];

        $scope.criteria = {
            radius: 2000,
            price: '1,4'
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

        $scope.searchRestaurants = function () {
            $rootScope.cardTitle = '';
            $rootScope.cuisineType = '';
            if ($scope.data.location) {
                console.log($scope.data.location);
                var latlng = $scope.data.location.geometry.location;
                console.log(latlng);
                $scope.criteria.ll =  latlng.lat() + ',' + latlng.lng();
            }
            $state.go('cards');
        };

        $scope.topTenRestaurants = function () {
            $state.go('topten');
        };

        $scope.selectCuisinesPopup = function () {
            console.log($ionicHistory.viewHistory());
        };
    };

    angular.module('app').
        controller('DashCtrl', DashCtrl);
})();
