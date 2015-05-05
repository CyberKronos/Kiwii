(function () {
    var FoursquareApi = function ($rootScope, $http) {
        /* Private Methods */
        var OAUTH_TOKEN = 'RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ';
        var API_VERSION = '20141020';
        var BASE_URL_VENUE = 'https://api.foursquare.com/v2/venues/';

        /* Public Interface */
        return {
            getRestaurantReviews: function (foursquareId) {
                var endpointUrl = 'https://api.foursquare.com/v2/venues/' + foursquareId + '/tips?oauth_token=' + OAUTH_TOKEN + '&v=' + API_VERSION;

                Parse.Cloud.run('callFoursquareApi', {url: endpointUrl})
                    .then(function (response) {
                        var tips = response.data.response.tips.items;
                        console.log(tips);
                        $rootScope.restaurantReviews = tips;
                    });
            },
            exploreRestaurants: function (queryParams) {
                var endpointUrl = BASE_URL_VENUE + '/explore?ll=49.282062,-123.122710&section=food&openNow=1&radius=1000&price=2&venuePhotos=1&oauth_token=' + OAUTH_TOKEN + '&v=' + API_VERSION;
                var venues = [];
                var transformVenueResponse = function (response) {
                    var itemsResponse = response.data.response.groups[0].items;

                    venues = itemsResponse.map(function (item, index) {
                        var venue = {};
                        var venuePhoto = item.venue.photos.groups[0].items[0];
                        venue['itemIndex'] = index + 1;
                        venue['foursquareId'] = item.venue.id;
                        venue['title'] = item.venue.name;
                        venue['rating'] = item.venue.rating;
                        venue['category'] = item.venue.categories[0].shortName;
                        venue['hours'] = item.venue.hours;
                        venue['imageUrl'] = venuePhoto.prefix + '500x500' + venuePhoto.suffix;
                        return venue;
                    });
                    return venues;
                };

                return Parse.Cloud.run('callFoursquareApi', {url: endpointUrl, queryParams: queryParams})
                    .then(transformVenueResponse);
            }
        }
    };

    angular.module('app').
        factory('FoursquareApi', FoursquareApi)
})();
