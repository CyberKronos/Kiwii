(function() {
  angular.module('kiwii').
    directive('restaurantMicroCard', function() {
      return {
        restrict: 'E',
        templateUrl: 'templates/restaurant_micro_card.html',
        replace: true,
        link: function(scope, el, attrs) {
          el.find('img').attr('src', attrs['image']);
          angular.element(el.find('p')[0]).text(attrs['name']);
          angular.element(el.find('p')[1]).text(attrs['type']);
        }
      }
    });
})();
