(function () {
  var AnalyticsTracking = function () {

    var ANALYTICS_CLASS = 'Analytics';
    var RESTAURANTS_CLASS = 'Restaurants';
    
    var RESTAURANT_ID_COLUMN = 'foursquareId';

    var SEARCH_HISTORY_ATTRIBUTE = 'searchHistory';
    var SELECTED_VENUE_HISTORY_ATTRIBUTE = 'selectedVenueHistory';

    var getRestaurant = function (foursquareId) {
      var Restaurants = Parse.Object.extend(RESTAURANTS_CLASS);
      var restaurantQuery = new Parse.Query(Restaurants)
        .equalTo(RESTAURANT_ID_COLUMN, foursquareId);

      return restaurantQuery.find()
        .then(function (results) {
          console.log(results);
          return results[0];
        });
    };

    /* Public Interface */
    return {
      searchQuery: function (trackingField) {
        var Analytics = Parse.Object.extend(ANALYTICS_CLASS);

        var searchQuery = new Analytics();
        searchQuery.set('radius', String(trackingField.radius));
        searchQuery.set('price', trackingField.price);
        searchQuery.set('query', trackingField.query);
        searchQuery.set('openNow', String(trackingField.openNow));
        // TODO: change to parse geopoint
        searchQuery.set('ll', trackingField.ll);

        searchQuery.save().
          then(function () {
            var saveSearchHistoryRelation = Parse.User.current().relation(SEARCH_HISTORY_ATTRIBUTE);
            saveSearchHistoryRelation.add(searchQuery);

            return Parse.User.current().save();
          });
      },

      explorerSelectedVenue: function (foursquarePlaceId) {
        var saveRestaurantsRelation = Parse.User.current().relation(SELECTED_VENUE_HISTORY_ATTRIBUTE);
        return getRestaurant(foursquarePlaceId)
          .then(function (restaurant) {
            saveRestaurantsRelation.add(restaurant);
            return Parse.User.current().save();
          });
      }
    };
  };

  angular.module('kiwii')
    .factory('AnalyticsTracking', AnalyticsTracking);
})();