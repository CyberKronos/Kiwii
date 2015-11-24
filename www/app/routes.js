(function () {
  var Routes = function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, CRITERIA_DEFAULTS) {
    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
      .state('start', {
        url: '/start',
        templateUrl: 'app/start/start.html',
        controller: 'StartCtrl',
        data: {
          authenticate: false
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/start/login.html',
        controller: 'LoginCtrl',
        data: {
          authenticate: false
        }
      })

      .state('handle', {
        url: '/handle',
        templateUrl: 'app/start/handle.html',
        controller: 'HandleCtrl',
        data: {
          authenticate: true
        }
      })

      .state('intro', {
        url: '/intro',
        templateUrl: 'app/start/intro.html',
        controller: 'IntroCtrl',
        data: {
          authenticate: true
        }
      })

      .state('search', {
        url: '/search',
        templateUrl: 'app/explore/search.html',
        controller: 'SearchCtrl',
        data: {
          authenticate: true
        }
      })

      .state('cards', {
        url: '/cards',
        templateUrl: 'app/explore/cards.html',
        controller: 'CardsCtrl',
        params: {
          criteria: {
            radius: CRITERIA_DEFAULTS.radius,
            price: CRITERIA_DEFAULTS.price,
            openNow: CRITERIA_DEFAULTS.openNow,
            query: CRITERIA_DEFAULTS.query,
            ll: '49.281441, -123.121682'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('details', {
        url: '/details/{venueId}',
        templateUrl: 'app/cardDetails/details.html',
        controller: 'DetailsCtrl',
        params: {
          card: null,
          restaurant: null
        },
        data: {
          authenticate: true
        }
      })

      .state('maps', {
        url: '/maps/{venueId}',
        templateUrl: 'app/maps/maps.html',
        controller: 'MapsCtrl',
        data: {
          authenticate: true
        }
      })

      .state('reviews', {
        url: '/reviews',
        templateUrl: 'app/reviews/reviews.html',
        controller: 'ReviewsCtrl',
        params: {
          reviews: null,
        },
        data: {
          authenticate: true
        }
      })

      .state('photos', {
        url: '/photos',
        templateUrl: 'app/photos/photos.html',
        controller: 'PhotosCtrl',
        params: {
          photos: null,
          venueId: null
        },
        data: {
          authenticate: true
        }
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'app/users/profile.html',
        controller: 'ProfileCtrl',
        params: {
          user: null
        },
        data: {
          authenticate: true
        }
      })

      .state('lists', {
        url: '/lists',
        templateUrl: 'app/lists/lists.html',
        controller: 'ListsCtrl',
        params: {
          list: null
        },
        data: {
          authenticate: true
        }
      })

      .state('listDetails', {
        url: '/listDetails',
        templateUrl: 'app/lists/list_details.html',
        controller: 'ListDetailsCtrl',
        params: {
          list: null
        },
        data: {
          authenticate: true
        }
      });

    $urlRouterProvider.otherwise('/search');
  };

  angular.module('kiwii')
    .config(Routes);
})();
