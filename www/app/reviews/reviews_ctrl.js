(function () {
  var ReviewsCtrl = function ($scope, $state, $stateParams, $ionicActionSheet, $cordovaInAppBrowser, FoursquareApi, Cards) {

    loadReviewsData();

    function loadReviewsData() {
      $scope.restaurantReviews = $stateParams.reviews;
    }
  };

  angular.module('kiwii')
    .controller('ReviewsCtrl', ReviewsCtrl)
})();