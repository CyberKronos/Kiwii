(function () {
  angular.module('kiwii').
    directive('microCard', function () {
      return {
        restrict: 'E',
        templateUrl: 'templates/micro_card.html',
        replace: true,
        scope: {
          title: '@',
          subtitle: '@',
          imageUrl: '@',
          fallbackImageUrl: '@',
          item: '='
        }
      }
    });
})();
