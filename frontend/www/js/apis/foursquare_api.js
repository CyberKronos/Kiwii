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
                var endpointUrl = BASE_URL_VENUE + '/explore?ll=43.604500004500004,-79.6437976014868&section=food&openNow=1&radius=1000&price=2&venuePhotos=1&oauth_token=' + OAUTH_TOKEN + '&v=' + API_VERSION;
                var venues = [];
                return Parse.Cloud.run('callFoursquareApi', {url: endpointUrl, queryParams: queryParams})
                    .then(function (response) {
                        var itemsResponse = response.data.response.groups[0].items;

                        venues = itemsResponse.map(function(item, index) {
                            var venue = {};
                            var venuePhoto = item.venue.photos.groups[0].items[0];
                            venue['id'] = index + 1;
                            venue['title'] = item.venue.name;
                            venue['imdbRating'] = item.venue.rating;
                            venue['imageUrl'] = venuePhoto.prefix + '500x500' + venuePhoto.suffix;
                            venue['primaryColor'] = '#FF0000';
                            return venue;
                        });
                        return venues;
                    });
            }
        }
    };

    angular.module('app').
        factory('FoursquareApi', FoursquareApi)
})();
