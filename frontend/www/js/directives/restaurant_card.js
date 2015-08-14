(function () {
  var restaurantCard = function () {

    var controller = ['$scope', '$cordovaInAppBrowser',
      function ($scope, $cordovaInAppBrowser) {
        $scope.openWebsite = function (link) {
          console.log(link);
          var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
          };
          $cordovaInAppBrowser.open(link, '_blank', options);
        };
      }];

    return {
      restrict: 'E',
      templateUrl: 'templates/restaurant_card.html',
      replace: true,
      scope: {
        restaurant: '='
      },
      controller: controller
    }
  };

  angular.module('kiwii').
    directive('restaurantCard', restaurantCard);
})();
