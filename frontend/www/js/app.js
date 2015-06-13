(function () {
  Parse.initialize("g3pJuFTV11d3QNG1zSGsn0Ea6b8OiYEve5gCXQWp", "RvkvXdhs719ZLD81BQGFCAhCq1kQf1yF3DqwBlZD");

  var kiwii = angular.module('kiwii',
    [ 'ionic',
      'ion-google-place',
      'ngCordova',
      'ngStorage',
      'ngFlux',
      'ionic.contrib.ui.tinderCards',
      'parse-angular',
      'image-preloader',
      'ionic.service.core',
      'ionic.service.deploy']);

  kiwii.config(function ($ionicAppProvider) {
    $ionicAppProvider.identify({
      // The App ID (from apps.ionic.io) for the server
      app_id: 'a0a3c396',
      // The public API key all services will use for this app
      api_key: 'c7f035d6607c60248b88b24af508da3635f205859fd1af52',
      // The GCM project ID (project number) from your Google Developer Console (un-comment if used)
      // gcm_id: 'YOUR_GCM_ID'
    });
  });

  kiwii.run(function ($ionicPlatform, $ionicApp, $rootScope, $state) {
    console.log('Running', $ionicApp.getApp());

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
