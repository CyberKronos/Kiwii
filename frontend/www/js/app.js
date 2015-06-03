(function () {
  var kiwii = angular.module('kiwii',
    ['ionic',
      'ion-google-place',
      'ngCordova',
      'ngStorage',
      'ngFlux',
      'ionic.contrib.ui.tinderCards',
      'parse-angular',
      'image-preloader']);

  kiwii.run(function ($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    // Load search rootscope
    $rootScope.searchCriteria = {
      price: '1,4',
      radius: 500,
      ll: ''
    };

    // Load current user from cache
    if (Parse.User.current()) {
      $rootScope.currentUser = Parse.User.current().attributes;
    }

    // UI Router Authentication Check
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
      if (toState.data.authenticate && !Parse.User.current()) {
        // User isn’t authenticated
        $state.transitionTo('start');
        event.preventDefault();
      }
    });
  });

  kiwii.filter('unsafe', function ($sce) {
    return $sce.trustAsHtml;
  });
})();
