(function() {
  var restaurantCard = function($ionicGesture) {
    return {
      restrict: 'E',
      templateUrl: 'templates/restaurant_card.html',
      replace: true
    }
  };

  angular.module('kiwii').
    directive('restaurantCard', restaurantCard);
})();
