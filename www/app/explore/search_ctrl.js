(function () {

  var SearchCtrl = function ($scope, $state, $timeout, LocationService, RestaurantExplorer, AutocompleteService, CRITERIA_OPTIONS, CRITERIA_DEFAULTS) {

    $scope.isLoadingLocation = true;
    $scope.criteria = _.clone(CRITERIA_DEFAULTS);
    $scope.cuisineList = CRITERIA_OPTIONS.CUISINE_TYPES;
    $scope.distanceLabel = getDistanceLabel($scope.criteria.radius);
    $scope.priceList = CRITERIA_OPTIONS.PRICES;
    $scope.openNow = true;
    $scope.specifiedLocation = {};
    $scope.currentLocationError = false;

    $scope.explore = explore;
    $scope.updateDistanceLabel = function (distance) {
      $scope.distanceLabel = getDistanceLabel(distance);
    };
    $scope.updateOpenNowValue = function () {
      $scope.criteria.openNow = ($scope.openNow.checked == true ? 1 : 0);
    };
    $scope.convertToLatLon = function (location) {
      if (location) {
        var latlng = location.geometry.location;
        $scope.criteria.ll = latlng.lat() + ',' + latlng.lng();
      }
    };

    $scope.getRestaurants = function(query) {
      return AutocompleteService.getRestaurants(query, $scope.criteria.ll, 'SEARCH');
    };

    $scope.restaurantsClicked = function (callback) {
      $state.go('details', {venueId: callback.item.foursquareId, restaurant: callback.item});
    };

    $scope.clearSpecifiedLocation = function () {
      if ($scope.specifiedLocation.result) {
        $scope.specifiedLocation.result= '';
        $scope.criteria.ll = '';
        fetchCurrentLocation();
      }
    };

    $scope.refreshCurrentLocation = function () {
      $scope.currentLocationError = false;
      fetchCurrentLocation();
    };

    function getDistanceLabel(distance) {
      var labels = CRITERIA_OPTIONS.DISTANCE_LABELS;
      return _.filter(labels, function (label) {
        return distance >= label.minDistance;
      })[0];
    }

    function explore(criteria) {
      serializePriceFilter($scope.priceList);
      $state.go('cards', {criteria: criteria});
    }

    function serializePriceFilter(priceList) {
      var selectedPriceRange = _.filter(priceList, _.property('checked'));
      $scope.criteria.price = _.pluck(selectedPriceRange, 'value').join(',');
    }

    function fetchCurrentLocation() {
      return LocationService.fetchCurrentLocation()
        .then(function (latLng) {
          $scope.criteria.ll = latLng.lat + ',' + latLng.lng;
          $scope.currentLocationError = false;
        })
        .catch(function (positionError) {
          LocationService.showErrorPopup(positionError);
          $scope.currentLocationError = true;
        });
    }

    $scope.$on('$ionicView.afterEnter', function () {
      fetchCurrentLocation();
    });

    $scope.$on('$ionicView.leave', function () { //This is fired twice in a row
      $scope.restaurantDetails = '';
    });
  };

  angular.module('kiwii').
    controller('SearchCtrl', SearchCtrl);
})();