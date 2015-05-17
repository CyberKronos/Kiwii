(function() {
  var FoursquareApi = function($http) {
        /* Private Methods */
        var OAUTH_TOKEN = 'RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ';
        var API_VERSION = '20141020';
        var BASE_URL_VENUE = 'https://api.foursquare.com/v2/venues/';

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
            }
        }
    };

    angular.module('app').
        factory('FoursquareApi', FoursquareApi)
})();
