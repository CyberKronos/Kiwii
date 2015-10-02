angular.module('kiwii')
  .factory('LocationService', ['$cordovaGeolocation', '$q', '$ionicPopup',
    function ($cordovaGeolocation, $q, $ionicPopup) {
      return {
        fetchCurrentLocation: fetchCurrentLocation,
        showErrorPopup: showLocationError
      };

      function fetchCurrentLocation() {
        var posOptions = {timeout: 50000, enableHighAccuracy: false};
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

      function showLocationError(positionError) {
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
    }]);