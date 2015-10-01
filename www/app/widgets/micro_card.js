(function () {
  angular.module('kiwii').
    directive('microCard', function () {
      return {
        restrict: 'E',
        templateUrl: 'app/widgets/micro_card.html',
        replace: true,
        scope: {
          title: '@',
          subtitle: '@',
          imageUrl: '@',
          fallbackImageUrl: '@',
          item: '='
        },
        link: function (scope, element) {
          var imageUrl = scope.imageUrl || scope.fallbackImageUrl;
          var title = scope.title;
          var subtitle = scope.subtitle;

          var image = element.find('img');
          var name = element.find('div');
          var type = name.next();

          image.attr('src', imageUrl);
          name.text(title);
          subtitle ? type.text(subtitle) : type.css('display', 'none');
        }
      }
    });
})();
