(function () {
  angular.module('kiwii')
    .factory('RestaurantExplorer', ['FoursquareApi', 'CRITERIA_DEFAULTS', 'CRITERIA_OPTIONS',
      function (FoursquareApi, CRITERIA_DEFAULTS, CRITERIA_OPTIONS) {
        var prevRestaurants = [];
        var criteria = {
          radius: CRITERIA_DEFAULTS.DISTANCE,
          price: CRITERIA_DEFAULTS.PRICES,
          query: CRITERIA_OPTIONS.CUISINE_TYPES[0]['name'],
          openNow: CRITERIA_DEFAULTS.OPEN
        };

        var service = {
          fetch: fetch,
          criteria: criteria,
          results: [],
          nextRestaurant: nextRestaurant,
          prevRestaurant: prevRestaurant
        };

        return service;

        function fetch() {
          clearOldSearchResults();
          return FoursquareApi.exploreRestaurants(criteria)
            .then(function (result) {
              service.results = result;
              return service.results;
            });
        }

        function nextRestaurant() {
          var lastRestaurant = service.results.shift();
          prevRestaurants.push(lastRestaurant);
          return service.results[0];
        }

        function prevRestaurant() {
          var lastRestaurant = prevRestaurants.pop();
          service.results.splice(0, 0, lastRestaurant);
          return service.results[0];
        }

        function clearOldSearchResults() {
          prevRestaurants = [];
          service.results = [];
        }
      }]);
})();
