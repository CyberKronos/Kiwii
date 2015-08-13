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
          searchRestaurant: searchRestaurant,
          nextRestaurant: nextRestaurant,
          prevRestaurant: prevRestaurant
        };

        return service;

        function searchRestaurant(geoPoint) {
          // Create a query for places
          var query = new Parse.Query('Restaurants');
          // Interested in locations near user.
          query.withinKilometers("geoPoint", geoPoint, 30000);
          // Limit what could be a lot of points.
          query.limit(1000);
          // Final list of objects
          return query.find()
            .then(function(results) {
              // console.log(results);
              return results;
            }, function(error) {
              // console.log(error);
              return error;
            });
        }

        function fetch(givenCritiera) {
          var queryCriteria = criteria;
          if (givenCritiera) {
            queryCriteria = givenCritiera;
          }
          clearOldSearchResults();
          return FoursquareApi.exploreRestaurants(queryCriteria)
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
