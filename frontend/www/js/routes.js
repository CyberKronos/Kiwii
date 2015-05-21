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

      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl',
        data: {
          authenticate: false
        }
      })

      .state('intro', {
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'IntroCtrl',
        data: {
          authenticate: true
        }
      })

      .state('dash', {
        url: '/dash',
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl',
        data: {
          authenticate: true
        }
      })

      .state('profile', {
        url: '/dash/profile',
        templateUrl: 'templates/profile.html',
        data: {
          authenticate: true
        }
      })

      .state('topten', {
        url: '/dash/topten',
        templateUrl: 'templates/topten.html',
        controller: 'TopTenCtrl',
        data: {
          authenticate: true
        }
      })

      .state('cards', {
        url: '/dash/cards',
        templateUrl: 'templates/cards.html',
        controller: 'CardsCtrl',
        data: {
          authenticate: true
        }
      })

      .state('details', {
        url: '/dash/list/details',
        templateUrl: 'templates/details.html',
        controller: 'DetailsCtrl',
        data: {
          authenticate: true
        }
      })

      .state('instagram', {
        url: '/dash/list/instagram',
        templateUrl: 'templates/instagram.html',
          controller: 'DetailsCtrl',
          data: {
          authenticate: true
        }
      })

      .state('reviews', {
        url: '/dash/list/reviews',
        templateUrl: 'templates/reviews.html',
          controller: 'DetailsCtrl',
          data: {
          authenticate: true
        }
      })

      .state('maps', {
        url: '/dash/list/details/maps',
        templateUrl: 'templates/maps.html',
        controller: 'MapsCtrl',
        data: {
          authenticate: true
        }
      });

    $urlRouterProvider.otherwise('/dash');
  }

  angular.module('app')
    .config(Routes);
})();
