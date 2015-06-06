// http://stackoverflow.com/questions/13781685/angularjs-ng-src-equivalent-for-background-imageurl
(function () {
    angular.module('kiwii').directive('backImg', function () {

        return function (scope, element, attrs) {
            var filter = '';
            if ('darken' in attrs) {
                filter = 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), ';
            }
            if ('toChild' in attrs) {
                element = element.children();
            }
            attrs.$observe('backImg', function (value) {
                var url = 'url(' + value + ')';
                element.css({
                    'background': filter + url + ' no-repeat',
                    'background-size': 'cover',
                    '-webkit-background-size': 'cover',
                    '-moz-background-size': 'cover',
                    '-o-background-size': 'cover'
                });
            });

        };
    });
})();