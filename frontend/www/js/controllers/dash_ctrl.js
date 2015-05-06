(function () {
    var DashCtrl = function ($scope, $rootScope, $ionicSideMenuDelegate, $state, $ionicHistory) {

        console.log($ionicHistory.currentView());

        $scope.distanceList = {
            min: '500',
            max: '15000',
            step: '500'
        };

        $scope.priceList = [
            {text: "$", value: "1"},
            {text: "$$", value: "2"},
            {text: "$$$", value: "3"},
            {text: "$$$$", value: "4"}
        ];

        $scope.criteria = {
            'radius': '500',
            'price': '1,4'
        };

        $scope.data = {};

        $rootScope.searchCriteria = $scope.criteria;

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
            // $ionicHistory.currentTitle('Main');
            console.log($ionicHistory.viewHistory());
        };
    }

    angular.module('app').
        controller('DashCtrl', DashCtrl);
})();
