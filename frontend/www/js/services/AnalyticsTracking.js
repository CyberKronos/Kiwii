(function () {
  var AnalyticsTracking = function () {

    var ANALYTICS_CLASS = 'Analytics';
    var SEARCH_HISTORY_ATTRIBUTE = 'searchHistory';

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
      }
    };
  };

  angular.module('kiwii')
    .factory('AnalyticsTracking', AnalyticsTracking);
})();