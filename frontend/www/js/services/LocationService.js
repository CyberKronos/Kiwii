angular.module('kiwii')
  .factory('LocationService', ['$cordovaGeolocation', function ($cordovaGeolocation) {
    return {
      fetchCurrentLocation: fetchCurrentLocation
    };

    function fetchCurrentLocation() {
      var posOptions = {timeout: 5000, enableHighAccuracy: false};
      return $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          return {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
    }
  }]);