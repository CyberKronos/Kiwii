(function() {
  var Routes = function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('dash', {
        url: '/dash',
        templateUrl: 'templates/dash.html',
        controller: 'DashCtrl',
        data: {
          requiresLogin: true
        }
      })

      .state('profile', {
        url: '/main/profile',
        templateUrl: 'templates/profile.html',
        data: {
          requiresLogin: true
        }
      })

      .state('cards', {
        url: '/main/cards',
        templateUrl: 'templates/cards.html',
        controller: 'CardsCtrl',
        data: {
          requiresLogin: true
        }
      })

      .state('details', {
        url: '/main/list/details',
        templateUrl: 'templates/details.html',
        data: {
          requiresLogin: true
        }
      })

      .state('instagram', {
        url: '/main/list/instagram',
        templateUrl: 'templates/instagram.html',
        data: {
          requiresLogin: true
        }
      })

      .state('reviews', {
        url: '/main/list/reviews',
        templateUrl: 'templates/reviews.html',
        data: {
          requiresLogin: true
        }
      });

    $urlRouterProvider.otherwise('/dash');
  }

  angular.module('app')
    .config(Routes);
})();
