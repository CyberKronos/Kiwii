(function () {
  var Routes = function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'app/layouts/tabs.html',
        data: {
          authenticate: true
        }
      })

      .state('tab.dash', {
        url: '/dash',
        views: {
          'dash': {
            templateUrl: 'app/dash/dash.html',
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
            templateUrl: 'app/explore/search.html',
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
            templateUrl: 'app/users/profile.html',
            controller: 'ProfileCtrl'
          }
        },
        params: {
          user: null
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.publicProfile', {
        url: '/publicProfile',
        cache: false,
        views: {
          'publicProfile': {
            templateUrl: 'app/users/profile.html',
            controller: 'ProfileCtrl'
          }
        },
        params: {
          user: null
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.photoDetails', {
        url: '/photoDetails',
        cache: false,
        views: {
          'publicProfile': {
            templateUrl: 'app/photoDetails/photo_details.html',
            controller: 'PhotoDetailsCtrl'
          }
        },
        params: {
          card : null
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.followers', {
        url: '/followers',
        cache: false,
        views: {
          'publicProfile': {
            templateUrl: 'app/users/followers.html',
            controller: 'FollowCtrl'
          }
        },
        params: {
          user : null,
          followers: null
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.following', {
        url: '/following',
        cache: false,
        views: {
          'publicProfile': {
            templateUrl: 'app/users/following.html',
            controller: 'FollowCtrl'
          }
        },
        params: {
          user : null,
          following: null
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
            templateUrl: 'app/lists/lists.html',
            controller: 'ListsCtrl'
          }
        },
        params: {
          list: null
        }
      })

      .state('tab.cards', {
        url: '/cards',
        views: {
          'search': {
            templateUrl: 'app/explore/cards.html',
            controller: 'CardsCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.details', {
        url: '/details/{venueId}',
        cache: false,
        views: {
          'details': {
            templateUrl: 'app/cardDetails/details.html',
            controller: 'DetailsCtrl'
          }
        },
        params: {
          card: null,
          restaurant: null
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.maps', {
        url: '/maps/{venueId}',
        views: {
          'details': {
            templateUrl: 'app/maps/maps.html',
            controller: 'MapsCtrl'
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
            templateUrl: 'app/cardCreation/images.html',
            controller: 'ImagesCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.activityFeed', {
        url: '/activityFeed',
        views: {
          'activityFeed': {
            templateUrl: 'app/feed/activity_feed.html',
            controller: 'ActivityFeedCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.discoverUsers', {
        url: '/discoverUsers',
        views: {
          'activityFeed': {
            templateUrl: 'app/users/discover_users.html',
            controller: 'DiscoverUsersCtrl'
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
