'use strict';

/**
 * @ngDoc controller
 * @name ng.controller:GlobalCtrl
 * @description
 * Adds common functions that all controllers in Kiwii will inherit.
 */
angular.module('kiwii')
  .controller('GlobalCtrl', ['$scope', '$rootScope', '$state', '$cordovaInAppBrowser', '$timeout', 'RestaurantExplorer', 'ALL_CUISINE_TYPES',
    function ($scope, $rootScope, $state, $cordovaInAppBrowser, $timeout, RestaurantExplorer, ALL_CUISINE_TYPES) {
      $scope.$state = $state;

      $scope.openWebsite = function (link) {
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'yes'
        };
        $cordovaInAppBrowser.open(link, '_blank', options);
      };

      $scope.getCuisineItems = function (query) {
        var searchItems = ALL_CUISINE_TYPES.CUISINE_TYPES;
        var returnValue = {items: []};
        searchItems.forEach(function (item) {
          var lowerCaseQuery = query.toLowerCase();
          if (item.name.toLowerCase().indexOf(lowerCaseQuery) > -1) {
            returnValue.items.push(item);
          }
          else if (item.id.toLowerCase().indexOf(lowerCaseQuery) > -1) {
            returnValue.items.push(item);
          }
        });
        return returnValue;
      };

      $scope.getRestaurants = function (query, type) {
        if (!query) {
          return {};
        }
        var params = {
          'query': query,
          'll': $rootScope.latlng,
          'radius': 50000,
          'limit': 10
        };

        if (type == 'SEARCH') {
          triggerExternalSearch(params);
        }
        return RestaurantExplorer.findWithKiwii(params)
          .then(function (restaurants) {
            return {
              items: restaurants
            };
          });
      };

      var searchIdleTimer;
      
      function triggerExternalSearch(params) {
        if (searchIdleTimer) {
          $timeout.cancel(searchIdleTimer);
        }
        searchIdleTimer = $timeout(RestaurantExplorer.findWithExternal.bind(null, params), 2000);
      }

    }]);