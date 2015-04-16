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

  app.run(function($ionicPlatform, $rootScope, $cordovaGeolocation) {
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
      counter: '',
      name: '',
      restaurantName: '',
      id: '',
      twitter: '',
      price: '',
      distance: '',
      cuisineId: '',
      latitude: '',
      longitude: ''
    }
    // Geolocation to get location position
    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      $rootScope.searchCriteria['latitude'] = lat;
      $rootScope.searchCriteria['longitude'] = long;
    }, function(err) {
      // error
      console.log("Error retrieving position " + err.code + " " + err.message)
    });

    console.log($rootScope.searchCriteria);
  });

  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('regionHttpInterceptor')
  });

  app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
})();
