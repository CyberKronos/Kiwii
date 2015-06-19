(function () {
  var DashCtrl = function ($scope, $ionicSideMenuDelegate, $state, $ionicHistory, $cordovaGeolocation, RestaurantExplorer, CRITERIA_OPTIONS) {

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
          $scope.criteria['ll'] = lat + ',' + long;
        }, function (err) {
          // error
          console.log("Error retrieving position " + err.code + " " + err.message)
        });
    }

    $scope.searchRestaurants = function () {
      $state.go('cards');
    };

    //$scope.topTenRestaurants = function () {
    //  $state.go('topten');
    //};
  };

  angular.module('kiwii').
    controller('DashCtrl', DashCtrl);
})
();
