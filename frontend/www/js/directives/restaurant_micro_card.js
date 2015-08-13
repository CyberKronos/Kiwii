(function() {
  angular.module('kiwii').
    directive('restaurantMicroCard', function() {
      return {
        restrict: 'E',
        templateUrl: 'templates/restaurant_micro_card.html',
        replace: true,
        scope: {
          restaurant: '='
        }
      }
    });
})();
