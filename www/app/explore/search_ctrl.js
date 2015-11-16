(function () {

  var SearchCtrl = function ($scope, $state, $timeout, LocationService, RestaurantExplorer, AutocompleteService, CRITERIA_OPTIONS, CRITERIA_DEFAULTS) {

/**
* Generates number of random geolocation points given a center and a radius.
* @param  {Object} center A JS object with lat and lng attributes.
* @param  {number} radius Radius in meters.
* @param {number} count Number of points to generate.
* @return {array} Array of Objects with lat and lng attributes.
*/
function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  console.log(points);
  return points;
}

/**
* Generates number of random geolocation points given a center and a radius.
* Reference URL: http://goo.gl/KWcPE.
* @param  {Object} center A JS object with lat and lng attributes.
* @param  {number} radius Radius in meters.
* @return {Object} The generated random points as JS object with lat and lng attributes.
*/
function generateRandomPoint(center, radius) {
  var x0 = center.lng;
  var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  console.log('y+y0'+','+'xp+x0');
  return y+y0+","+xp+x0;
}

var randomGeoPoint = generateRandomPoint({'lat':49.2667, 'lng':-122.9667}, 30000);
console.log(randomGeoPoint);

    fetchCurrentLocation();

    $scope.isLoadingLocation = true;
    $scope.criteria = _.clone(CRITERIA_DEFAULTS);
    $scope.cuisineList = CRITERIA_OPTIONS.CUISINE_TYPES;
    $scope.distanceLabel = getDistanceLabel($scope.criteria.radius);
    $scope.priceList = CRITERIA_OPTIONS.PRICES;
    $scope.openNow = true;

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
          $scope.criteria['ll'] = latLng.lat + ',' + latLng.lng;
        })
        .catch(LocationService.showErrorPopup);
    }

    $scope.$on('$ionicView.leave', function () { //This is fired twice in a row
      $scope.restaurantDetails = '';
    });
  };

  angular.module('kiwii').
    controller('SearchCtrl', SearchCtrl);
})();