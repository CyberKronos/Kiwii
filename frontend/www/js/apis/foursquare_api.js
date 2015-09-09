(function () {
  var FoursquareApi = function ($q) {
    /* Private Methods */
    var OAUTH_TOKEN = 'RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ';
    var API_VERSION = '20141020';
    var BASE_URL_VENUE = 'https://api.foursquare.com/v2/venues/';

    var RESTAURANTS_CLASS = 'Restaurants';
    var RESTAURANT_ID_COLUMN = 'foursquareId';

    /* Public Interface */
    return {
      getRestaurantReviews: function (foursquareId) {
        var endpointUrl = BASE_URL_VENUE + foursquareId + '/tips?oauth_token=' + OAUTH_TOKEN + '&v=' + API_VERSION;

        return Parse.Cloud.run('callFoursquareApi', {url: endpointUrl})
          .then(function (response) {
            var tips = response.tips.items;
            console.log(tips);
            return tips;
          });
      },
      exploreRestaurants: function (queryParams) {
        console.log(queryParams);
        return Parse.Cloud.run('explore', {queryParams: queryParams});
      },
      getRestaurantDetails: function (foursquareId) {
        var endpointUrl = BASE_URL_VENUE + foursquareId + '?oauth_token=' + OAUTH_TOKEN + '&v=' + API_VERSION;

        return Parse.Cloud.run('callFoursquareApi', {url: endpointUrl})
          .then(function (response) {
            var details = response.venue;
            console.log(details);
            return details;
          });
      },
      getRestaurantById: memoizedGetRestaurantById()
    };

    function memoizedGetRestaurantById() {
      var memoized = _.memoize(getRestaurantById);
      return function (restaurantId, options) {
        if (options && options['refresh']) {
          memoized.cache.set(restaurantId, undefined);
        }
        return memoized(restaurantId);
      }
    }

    function getRestaurantById(restaurantId) {
      var Restaurants = Parse.Object.extend(RESTAURANTS_CLASS);
      var restaurantQuery = new Parse.Query(Restaurants)
        .equalTo(RESTAURANT_ID_COLUMN, restaurantId);

      return restaurantQuery.first()
        .then(function (restaurant) {
          return restaurant ? $q.when(restaurant)
            : $q.reject({message: 'Restaurant Foursquare ID "' + restaurantId + '" Not Found'});
        })
        .fail(function (error) {
          return $q.reject(error);
        });
    }
  };

  angular.module('kiwii').
    factory('FoursquareApi', FoursquareApi)
})();
