(function () {
  var PhotoDetailsCtrl = function ($scope, $state, $stateParams, FoursquareApi) {

    loadPhotoData();

    $scope.restaurantDetails = function (foursquareId) {
        $state.go('tab.details', {
            venueId: foursquareId,
            card: $stateParams.card
        });
    };

    function loadPhotoData() {
      $scope.photoData = $stateParams.card.attributes.photos[0].attributes;
      $scope.restaurantData = $stateParams.card.attributes.taggedRestaurant.attributes;
      console.log($scope.restaurantData);
    }
  };

  angular.module('kiwii')
    .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)
})();