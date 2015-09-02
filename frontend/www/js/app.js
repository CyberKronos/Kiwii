(function () {
  var kiwii = angular.module('kiwii',
    [ 'ionic',
      'ion-google-place',
      'ion-autocomplete',
      'ngCordova',
      'ngStorage',
      'ngFlux',
      'ionic.contrib.ui.tinderCards',
      'parse-angular',
      'image-preloader',
      'ionic.service.core',
      'ionic.service.deploy',
      'ng-mfb'
      // 'ionic.service.analytics'
      ]);

  // the configs
  var config = {
    parse: {
      applicationId: 'g3pJuFTV11d3QNG1zSGsn0Ea6b8OiYEve5gCXQWp',
      javascriptId: 'RvkvXdhs719ZLD81BQGFCAhCq1kQf1yF3DqwBlZD'
    },
    stream: {
      key: 'xwqcm8d4w27c',
      site: '5290'
    }
  }

  // initialize parse
  Parse.initialize(config.parse.applicationId, config.parse.javascriptId);
  
  // initialize stream
  // StreamClient = stream.connect(config.stream.key, null, config.stream.site);

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

  kiwii.run(function ($ionicPlatform, $ionicApp, $rootScope, $state, $cordovaStatusbar) {
    console.log('Running', $ionicApp.getApp());

    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        $cordovaStatusbar.overlaysWebView(true);
        // Load current user from cache
        if (Parse.User.current()) {
          $rootScope.currentUser = Parse.User.current().attributes;
          $cordovaStatusbar.style(0);
          console.log($rootScope.currentUser);
        } else {
          $cordovaStatusbar.style(1);
        }
      } else {
        if (Parse.User.current()) {
          $rootScope.currentUser = Parse.User.current().attributes;
        }
      }
    });

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
