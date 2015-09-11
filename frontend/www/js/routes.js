(function () {
  var Routes = function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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

      .state('handle', {
        url: '/handle',
        templateUrl: 'templates/handle.html',
        controller: 'HandleCtrl',
        data: {
          authenticate: true
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
            templateUrl: 'templates/profile.html',
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
        views: {
          'profile': {
            templateUrl: 'templates/photo_details.html',
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
            templateUrl: 'templates/followers.html',
            controller: 'FollowCtrl'
          },
        },
        params: {
          user : null
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
            templateUrl: 'templates/following.html',
            controller: 'FollowCtrl'
          }
        },
        params: {
          user : null
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
        url: '/details/{venueId}',
        cache: false,
        views: {
          'details': {
            templateUrl: 'templates/details.html',
            controller: 'DetailsCtrl'
          }
        },
        params: {
          card: null
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.maps', {
        url: '/maps/{venueId}',
        views: {
          'details': {
            templateUrl: 'templates/maps.html',
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
            templateUrl: 'templates/images.html',
            controller: 'ImagesCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.exploreLists', {
        url: '/exploreLists',
        views: {
          'exploreLists': {
            templateUrl: 'templates/explore_lists.html',
            controller: 'ExploreListsCtrl'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.discoverUsers', {
        url: '/discoverUsers',
        views: {
          'exploreLists': {
            templateUrl: 'templates/discover_users.html',
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
