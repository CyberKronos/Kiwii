angular.module('kiwii')
  .factory('AutocompleteService', ['$timeout', 'RestaurantExplorer', 'ALL_CUISINE_TYPES',
    function ($timeout, RestaurantExplorer, ALL_CUISINE_TYPES) {
      return {
        getCuisineItems: getCuisineItems,
        getRestaurants: getRestaurants
      };

      function getCuisineItems(query) {
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

      function getRestaurants(query, latlng, type) {
        if (!query) {
          return {};
        }
        var params = {
          'query': query,
          'll': latlng,
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