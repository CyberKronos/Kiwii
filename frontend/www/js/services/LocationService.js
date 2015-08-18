angular.module('kiwii')
  .factory('LocationService', ['$cordovaGeolocation', '$q',
    function ($cordovaGeolocation, $q) {
      return {
        fetchCurrentLocation: fetchCurrentLocation
      };

      function fetchCurrentLocation() {
        var posOptions = {timeout: 300, enableHighAccuracy: false};
        return $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            return {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          })
          .catch(function (positionError) {
            var errorMessage = '';
            if (positionError.code === positionError.PERMISSION_DENIED) {
              errorMessage = 'Kiwii has no permission to get your location. Please check your settings.'
            } else {
              errorMessage = 'Your device is having trouble getting your location. Please check your settings.'
            }
            positionError.label = errorMessage;
            return $q.reject(positionError);
          })
      }
    }]);