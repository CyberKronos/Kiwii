(function() {
  var Routes = function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('start', {
        url: '/start',
        templateUrl: 'templates/start.html',
        controller: 'StartCtrl',
        data: {
          authenticate: false
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
        data: {
          authenticate: false
        }
      })

      // .state('register', {
      //   url: '/register',
      //   templateUrl: 'templates/register.html',
      //   controller: 'RegisterCtrl',
      //   data: {
      //     authenticate: false
      //   }
      // })

      .state('intro', {
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl',
        data: {
          authenticate: true
        }
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        data: {
          authenticate: true
        }
      })

      .state('tab.dash', {
        url: '/dash',
        views: {
          'dash': {
            templateUrl: 'templates/dash.html',
            controller: 'DashCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      // .state('dash', {
      //   url: '/dash',
      //   templateUrl: 'templates/dash.html',
      //   controller: 'DashCtrl',
      //   data: {
      //     authenticate: true
      //   }
      // })

      .state('tab.profile', {
        url: '/profile',
        views: {
          'profile': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      // .state('topten', {
      //   url: '/dash/topten',
      //   templateUrl: 'templates/topten.html',
      //   controller: 'TopTenCtrl',
      //   data: {
      //     authenticate: true
      //   }
      // })

      .state('tab.cards', {
        url: '/dash/cards',
        views: {
          'dash': {
            templateUrl: 'templates/cards.html',
            controller: 'CardsCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.details', {
        url: '/dash/list/details',
        cache: false,
        views: {
          'dash': {
            templateUrl: 'templates/details.html',
            controller: 'DetailsCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.maps', {
        url: '/dash/list/details/maps',
        views: {
          'dash': {
            templateUrl: 'templates/maps.html',
            controller: 'MapsCtrl',
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.images', {
        url: '/images',
        views: {
          'images': {
            templateUrl: 'templates/images.html',
            controller: 'ImagesCtrl',
          }
        },
        data: {
          authenticate: true
        }
      });

    $urlRouterProvider.otherwise('/tab/dash');
  };

  angular.module('kiwii')
    .config(Routes);
})();
