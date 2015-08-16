'use strict';

var OAUTH_TOKEN = 'RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ';
var API_VERSION = '20141020';
var BASE_URL_VENUE = 'https://api.foursquare.com/v2/venues/';
var IMAGE_SIZE = '500x500';

// Foursquare Api
Parse.Cloud.define("callFoursquareApi", function (request, response) {
  Parse.Cloud.httpRequest({
    method: "GET",
    url: request.params.url,
    params: request.params.queryParams,
    success: function (httpResponse) {
      var responseBody = JSON.parse(httpResponse.text);
      response.success(responseBody.response);
    },
    error: function (httpResponse) {
      response.error("Request failed with response code:" + httpResponse.status + " Message: " + httpResponse.text);
    }
  });
});

Parse.Cloud.define('explore', function (request, response) {
  if (request.params.queryParams.query == '') {
    request.params.queryParams.section = 'food';
  }
  request.params.queryParams.venuePhotos = 1;
  request.params.queryParams.oauth_token = OAUTH_TOKEN;
  request.params.queryParams.v = API_VERSION;

  Parse.Cloud.httpRequest({
    method: "GET",
    url: BASE_URL_VENUE + 'explore',
    params: request.params.queryParams,
    success: parseHttpResponse,
    error: function (httpResponse) {
      response.error("Request failed with response code:" + httpResponse.status + " Message: " + httpResponse.text);
    }
  });

  function parseHttpResponse(httpResponse) {
    var apiResponse = JSON.parse(httpResponse.text).response;
    console.log(apiResponse);
    var items = apiResponse.groups[0].items;
    var venues = items.map(transformVenueResponse);

    // For caching to work, it must be done before returning the response (AFAIK a Parse restriction)
    cacheVenues(venues)
      .then(function () {
        response.success(venues);
      },
      function (error) {
        response.error(error);
      });
  }
});

Parse.Cloud.define('favourites', function (request, response) {
  var FAVOURITES_CLASS = 'Favourites';
  var USER_CLASS = '_User';
  var USER_COLUMN = 'user';

  new Parse.Query(USER_CLASS).get(request.params['userId'])
    .then(function (user) {
      return new Parse.Query(FAVOURITES_CLASS)
        .equalTo(USER_COLUMN, user)
        .find()
    })
    .then(function (favourites) {
      response.success(favourites);
    }, function (errorResponse) {
      response.error(errorResponse);
    });
});

function transformVenueResponse(item) {
  var venue = {};
  var apiVenue = item.venue;

  venue['foursquareId'] = apiVenue.id;
  venue['name'] = apiVenue.name;
  venue['rating'] = apiVenue.rating;
  venue['category'] = apiVenue.categories[0].shortName;
  venue['hours'] = apiVenue.hours;
  venue['url'] = apiVenue.url;
  venue['location'] = apiVenue.location;
  venue['tips'] = item.tips;
  venue['reservations'] = apiVenue.reservations;

  if (apiVenue.featuredPhotos && apiVenue.featuredPhotos.count > 0) {
    var featuredPhoto = apiVenue.featuredPhotos.items[0];
    venue['imageUrl'] = featuredPhoto.prefix + IMAGE_SIZE + featuredPhoto.suffix;
  } else if (apiVenue.photos && apiVenue.photos.groups.length != 0) {
    var venuePhoto = apiVenue.photos.groups[0].items[0];
    venue['imageUrl'] = venuePhoto.prefix + IMAGE_SIZE + venuePhoto.suffix;
  }
  return venue;
}

function cacheVenues(venues) {
  var RESTAURANT_CLASS = 'Restaurants';
  var Restaurant = Parse.Object.extend(RESTAURANT_CLASS);
  var promises = venues.map(function (venue) {
    return new Parse.Query(RESTAURANT_CLASS)
      .equalTo('foursquareId', venue.foursquareId)
      .find()
      .then(function (results) {
        if (results.length) {
          console.log('Updating cache for ' + venue.name);
          return results[0].save(venue);
        } else {
          console.log('Saving new restaurant: ' + venue.name);
          return new Restaurant().save(venue);
        }
      })
      .then(function (restaurant) {
        return restaurant;
      },
      function (error) {
        console.log(error);
        return error;
      });
  });
  return Parse.Promise.when(promises);
}