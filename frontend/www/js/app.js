(function() {
  var app = angular.module('app',
    ['ionic',
     'ion-google-place',
     'ngCordova',
     'ngStorage',
     'ngFlux',
     'ionic.contrib.ui.tinderCards',
     'auth0',
     'angular-jwt'])

  app.run(function($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
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
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.data.authenticate && !Parse.User.current()) {
        // User isn’t authenticated
        $state.transitionTo('start');
        event.preventDefault(); 
      }
    });
  });

  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('regionHttpInterceptor')
  });

  app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
})();
