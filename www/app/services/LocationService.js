angular.module('kiwii')
  .factory('LocationService', ['$cordovaGeolocation', '$q', '$ionicPopup',
    function ($cordovaGeolocation, $q, $ionicPopup) {
      return {
        fetchCurrentLocation: fetchCurrentLocation,
        showErrorPopup: showLocationError
      };

      function fetchCurrentLocation() {
        var posOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 0};
        return $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            return {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          })
          .catch(function (positionError) {
            switch (positionError.code) {
              case positionError.PERMISSION_DENIED:
                positionError.label = 'Kiwii has no permission to get your location. Please check your settings.';
                break;
              case positionError.TIMEOUT:
                positionError.label = 'Location timeout - Your device is having trouble getting your location. Please check your reception.'
                break;
              default:
                positionError.label = 'Your device is having trouble getting your location. Please check your settings.'
            }
            return $q.reject(positionError);
          })
      }

      function showLocationError(positionError) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Current Location Unavailable',
          template: positionError.label,
          buttons: buildButtonSet()
        });

        function buildButtonSet() {
          var buttons = [{text: 'OK'}];
          var isAndroid = ionic.Platform.isAndroid();
          if (isAndroid) {
            buttons.push({
              text: 'Settings',
              type: 'button-assertive',
              onTap: function () {
                confirmPopup.close();
                cordova.plugins.diagnostic.switchToLocationSettings();
              }
            })
          }
          return buttons;
        }
      }
    }]);
