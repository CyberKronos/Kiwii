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
                var endpointUrl = BASE_URL_VENUE + 'explore';

                queryParams.section = 'food';
                queryParams.openNow = 1;
                queryParams.venuePhotos = 1;
                queryParams.oauth_token = OAUTH_TOKEN;
                queryParams.v = API_VERSION;

                var venues = [];
                var transformVenueResponse = function (response) {
                    var itemsResponse = response.groups[0].items;

                    venues = itemsResponse.map(function (item, index) {
                        var venue = {};
                        venue['itemIndex'] = index + 1;
                        venue['foursquareId'] = item.venue.id;
                        venue['title'] = item.venue.name;
                        venue['rating'] = item.venue.rating;
                        venue['category'] = item.venue.categories[0].shortName;
                        venue['hours'] = item.venue.hours;

                        if (item.venue.photos.groups.length != 0) {
                            var venuePhoto = item.venue.photos.groups[0].items[0];
                            venue['imageUrl'] = venuePhoto.prefix + '500x500' + venuePhoto.suffix;
                        }
                        return venue;
                    });
                    return venues;
                };

                return Parse.Cloud.run('callFoursquareApi', {url: endpointUrl, queryParams: queryParams})
                    .then(transformVenueResponse);
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
        }
    };

    angular.module('app').
        factory('FoursquareApi', FoursquareApi)
})();
