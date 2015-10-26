(function () {
  angular.module('kiwii')
    .factory('RestaurantExplorer', ['$q', 'FoursquareApi', 'Cards', 'CRITERIA_DEFAULTS', 'CRITERIA_OPTIONS',
      function ($q, FoursquareApi) {
        return {
          exploreWithExternal: exploreWithExternal,
          findWithKiwii: findWithKiwii,
          findWithExternal: findWithExternal,
          findZomatoCollections: findZomatoCollections
        };

        /**
         Finds Restaurants with Kiwii's Database (in Parse).
         @param {Object} criteria The search criteria parameter is expected to be in the same format as the one used for
         searching through the Foursquare /venues/search API.
         **/
        function findWithKiwii(criteria) {
          // Create a query for places
          var query = new Parse.Query('Restaurants');
          // Keyword(s) provided by the user
          if (criteria.query) {
            query.containsAll('nameIndex', criteria.query.toLowerCase().match(/\S+/g));
          }
          // Interested in locations near user.
          if (criteria.ll) {
            query.withinKilometers("geoPoint", toGeoPoint(criteria.ll), criteria.radius / 1000);
          }
          // Limit what could be a lot of points.
          query.limit(criteria.limit);
          // Final list of objects
          return query.find()
            .then(function (results) {
              results = new Parse.Collection(results);
              return results.toJSON();
            });
        }

        /**
         * Finds restaurants with an External Database (e.g. Foursquare).
         @param {Object} criteria The search criteria parameter is expected to be in the same format as the one used for
         searching through the Foursquare /venues/search API.
         * @returns {Promise} promise that resolves to a list of Parse Restaurant Objects.
         */
        function findWithExternal(criteria) {
          var deferred = $q.defer();

          Parse.Cloud.run('foursquareSearch', {queryParams: criteria})
            .then(function (response) {
              var results = _.map(response, _.method('toJSON'));
              return deferred.resolve(results);
            })
            .fail(deferred.reject);
          return deferred.promise;
        }

        /**
         * Finds Zomato Collections.
         */
        function findZomatoCollections(criteria) {
          var deferred = $q.defer();

          Parse.Cloud.run('findCollections', {queryParams: criteria})
            .then(function (response) {
              var collections = response.collections;
              console.log(collections)
              return deferred.resolve(collections);
            })
            .fail(deferred.reject);
          return deferred.promise;
        }

        /**
         * Calls Foursquare's venues/explore API and returns the results in an array of Cards.
         * @param {Object} criteria The search criteria parameter is expected to be in the same format as the one used for
         searching through the Foursquare /venues/explore API.
         * @returns {Array<Cards>} An array of Cards
         */
        function exploreWithExternal(criteria) {
          return FoursquareApi.exploreRestaurants(criteria)
        }

        function toGeoPoint(string) {
          if (!string) {
            return new Parse.GeoPoint();
          }
          var latLng = _.map(string.split(','), parseFloat);
          return new Parse.GeoPoint(latLng[0], latLng[1]);
        }
      }]);
})();
