(function () {

    var DashCtrl = function ($scope, $ionicSideMenuDelegate, $state, $ionicHistory, $cordovaGeolocation, $cordovaStatusbar, $ionicPopup, RestaurantExplorer, CRITERIA_OPTIONS) {

        if (window.cordova) { 
          $cordovaStatusbar.style(0);
        }

        $scope.isLoadingLocation = true;

        fetchCurrentLocation()
            .then(function () {
                $scope.isLoadingLocation = false;
            });

        $scope.cuisineList = CRITERIA_OPTIONS.CUISINE_TYPES;

        $scope.priceList = CRITERIA_OPTIONS.PRICES;

        $scope.criteria = RestaurantExplorer.criteria;

        $scope.openNow = {
            text: 'Open restaurants only',
            checked: true
        };

        $scope.fields = {};

        $scope.distanceLabel = getDistanceLabel($scope.criteria.radius);

        $scope.updateDistanceLabel = function (distance) {
          $scope.distanceLabel = getDistanceLabel(distance);
          $scope.$digest();
        };

        $scope.updatePriceValue = function() {
            var i;
            var priceList = [];
            for (i = 0; i < $scope.priceList.length; i++) {
                if ($scope.priceList[i].checked) {
                    priceList.push($scope.priceList[i].value);
                }
            }
            $scope.criteria.price = createCommaSeparatedList(priceList);
        };

        $scope.updateOpenNowValue = function () {
          $scope.criteria.openNow = ($scope.openNow.checked == true ? 1 : 0);
          console.log($scope.criteria);
        };

        $scope.convertToLatLon = function (location) {
          if (location) {
            console.log($scope.fields.location);
            var latlng = $scope.fields.location.geometry.location;
            console.log(latlng);
            $scope.criteria.ll = latlng.lat() + ',' + latlng.lng();
          }
        };

        $scope.getCurrentLocation = function () {
          $scope.fields.location = '';
          $scope.criteria['ll'] = '';
          fetchCurrentLocation();
        };

        $scope.logCuisine = function() {
            console.log($scope.criteria);
        };

        // Still need?
        // $scope.updateLocation = function() {
        //     $scope.isLoadingLocation = false;
        // };

        $scope.searchRestaurants = function () {
          $state.go('tab.cards');
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

        function createCommaSeparatedList(arr) {
          return arr.map(function (obj) {
            return obj;
          }).join(',');
        }

        function fetchCurrentLocation() {
          // Geolocation to get location position
          var posOptions = {timeout: 5000, enableHighAccuracy: false};
          return $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
              var lat = position.coords.latitude;
              var long = position.coords.longitude;
              $scope.criteria['ll'] = lat + ',' + long;
            }, function (err) {
              // error
              var confirmPopup = $ionicPopup.confirm({
                title: 'Location Error',
                template: "Error retrieving position. Check your connection and location settings?",
                buttons: [
                  {
                    text: 'Cancel'
                  },
                  {
                    text: 'Ok',
                    type: 'button-assertive',
                    onTap: function() {
                      confirmPopup.close();
                      cordova.plugins.diagnostic.switchToLocationSettings();
                      setTimeout(function() {
                        fetchCurrentLocation().then(function() {
                          $scope.isLoadingLocation = false;
                        });
                      }, 8000);
                    }
                  }
                ]
              });
            });
        }
    };

  angular.module('kiwii').
    controller('SearchCtrl', DashCtrl);
})
();
