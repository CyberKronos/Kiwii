(function () {
  var AddCardModalCtrl = function ($scope, $state, $ionicLoading, $ionicPopup,
                                   parameters, Cards, RestaurantExplorer, LocationService) {

    fetchCurrentLocation();

    $scope.imagePost = parameters.images;

    $scope.postPhoto = function () {
      showLoading();

      Cards.createCard({
          userPhotos: parameters.images,
          author: Parse.User.current(),
          taggedRestaurant: parameters.images[0].foursquareId
        }
      )
        .then(function () {
          hideLoading();
          $scope.closeModal();
          $state.go('tab.profile');
        })
        .catch(function (error) {
          hideLoading();
          $ionicPopup.alert({
            title: 'Posting Error',
            template: error,
            buttons: [
              {
                text: 'Ok',
                type: 'button-assertive'
              }
            ]
          });
        })
        .finally(hideLoading);
    };

    $scope.getRestaurants = function (query) {
      if (!query) {
        return {};
      }
      return RestaurantExplorer.findWithKiwii({
        'query': query,
        'll': $scope.latlng,
        'radius': 50000,
        'limit': 10
      })
        .then(function (restaurants) {
          return {
            items: restaurants
          };
        });
    };

    $scope.restaurantsClicked = function (callback) {
      $scope.imagePost[0]['foursquareId'] = callback.item.foursquareId;
      console.log($scope.imagePost);
    };

    function showLoading() {
      $scope.isLoading = true;
      $ionicLoading.show({
        template: 'Posting photo...'
      });
    }

    function hideLoading() {
      $scope.isLoading = false;
      $ionicLoading.hide();
    }

    function fetchCurrentLocation() {
      LocationService.fetchCurrentLocation()
        .then(function (latLng) {
          $scope.latlng = latLng.lat + ',' + latLng.lng;
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
                type: 'button-assertive'
              }
            ]
          });
        });
    }
  };
  angular.module('kiwii').
    controller('AddCardModalCtrl', AddCardModalCtrl);
})();
