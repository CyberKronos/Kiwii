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
        url: '/dash/profile',
        templateUrl: 'templates/profile.html',
        data: {
          requiresLogin: true
        }
      })

      .state('cards', {
        url: '/dash/cards',
        templateUrl: 'templates/cards.html',
        controller: 'CardsCtrl',
        data: {
          requiresLogin: true
        }
      })

      .state('details', {
        url: '/dash/list/details',
        templateUrl: 'templates/details.html',
        controller: 'DetailsCtrl',
        data: {
          requiresLogin: true
        }
      })

      .state('instagram', {
        url: '/dash/list/instagram',
        templateUrl: 'templates/instagram.html',
        data: {
          requiresLogin: true
        }
      })

      .state('reviews', {
        url: '/dash/list/reviews',
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
