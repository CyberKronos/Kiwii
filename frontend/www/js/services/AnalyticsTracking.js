(function () {
  var AnalyticsTracking = function () {

    /* Public Interface */
    return {
      searchQuery: function (trackingField) {
        var dimensions = {
          radius: String(trackingField.radius),
          price:  trackingField.price,
          query: trackingField.query,
          openNow: String(trackingField.openNow),
          ll: trackingField.ll 
        };

        return Parse.Analytics.track('searchQuery', dimensions);
      },

      explorerSelectedVenue: function (venueId) {
        var dimensions = {
          venueId: venueId
        };

        return Parse.Analytics.track('explorerSelectedVenue', dimensions);
      }
    };
  };

  angular.module('kiwii')
    .factory('AnalyticsTracking', AnalyticsTracking);
})();