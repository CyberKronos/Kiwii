(function() {
  var Routes = function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');

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

      .state('tab.search', {
        url: '/search',
        views: {
          'search': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

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

      .state('tab.photoDetails', {
        url: '/photoDetails',
        views: {
          'profile': {
            templateUrl: 'templates/photo_details.html',
            controller: 'PhotoDetailsCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.lists', {
        url: '/lists',
        cache: false,
        views: {
          'lists': { 
            templateUrl: 'templates/lists.html',
            controller: 'ListsCtrl'
          }
        }
      })

      .state('tab.cards', {
        url: '/cards',
        views: {
          'search': {
            templateUrl: 'templates/cards.html',
            controller: 'CardsCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.details', {
        url: '/details',
        cache: false,
        views: {
          'details': { 
            templateUrl: 'templates/details.html',
            controller: 'DetailsCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.maps', {
        url: '/maps',
        views: {
          'details': {
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
