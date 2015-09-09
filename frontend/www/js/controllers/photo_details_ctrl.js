(function () {
  var PhotoDetailsCtrl = function ($scope, $state, $stateParams, FoursquareApi) {

    loadPhotoData();

    $scope.restaurantDetails = function (foursquareId) {
      $state.go('tab.details', {venueId: foursquareId});
    };

    function loadPhotoData() {
      var photo = $stateParams.photo;
      photo['restaurant'].fetch()
        .then(function (restaurant) {
          $scope.photoData = photo;
          $scope.photoData['restaurant'] = restaurant.toJSON();
          console.log($scope.photoData);
        }, function (error) {
          console.log(error);
        });
    }
  };

  angular.module('kiwii')
    .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)
})();