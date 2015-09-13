(function () {

  var SearchCtrl = function($scope, $localStorage, $ionicSideMenuDelegate, $state, $ionicHistory, $cordovaGeolocation, $timeout,
                            LocationService, $cordovaStatusbar, $ionicPopup, RestaurantExplorer, RestaurantDetails, CRITERIA_OPTIONS) {

    $scope.$on('$ionicView.leave', function () { //This is fired twice in a row
      $scope.restaurantDetails = '';
    });

    $scope.isLoadingLocation = true;

    fetchCurrentLocation();

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

    $scope.updatePriceValue = function () {
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

    $scope.getRestaurants = function (query) {
      if (!query) {
        return {};
      }
      var params = {
        'query': query,
        'll': $scope.criteria['ll'],
        'radius': 50000,
        'limit': 10
      };

      triggerExternalSearch(params);
      return RestaurantExplorer.findWithKiwii(params)
        .then(function (restaurants) {
          return {
            items: restaurants
          };
        });
    };

    var searchIdleTimer;
    function triggerExternalSearch(params) {
      if (searchIdleTimer) {
        $timeout.cancel(searchIdleTimer);
      }
      searchIdleTimer = $timeout(RestaurantExplorer.findWithExternal.bind(null, params), 2000);
    }

    $scope.restaurantsClicked = function (callback) {
      console.log(callback);
      $state.go('tab.details', {venueId: callback.item.foursquareId});
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
      return LocationService.fetchCurrentLocation()
        .then(function (latLng) {
          $scope.criteria['ll'] = latLng.lat + ',' + latLng.lng;
        })
        .catch(showLocationError);
    }

      function showLocationError (positionError) {
        var isAndroid = ionic.Platform.isAndroid();
        var confirmPopup = $ionicPopup.confirm({
            title: 'Current Location Unavailable',
            template: positionError.label,
            buttons: [
              {
                text: 'Cancel'
              },
              {
                text: 'Ok',
                type: 'button-assertive',
                onTap: function () {
                  confirmPopup.close();
                  if (isAndroid) {
                    cordova.plugins.diagnostic.switchToLocationSettings();
                    setTimeout(function () {
                      fetchCurrentLocation().then(function () {
                        $scope.isLoadingLocation = false;
                      });
                    }, 8000);
                  }
                }
              }
            ]
          });
        }
    };

  angular.module('kiwii').
    controller('SearchCtrl', SearchCtrl);
})
();
