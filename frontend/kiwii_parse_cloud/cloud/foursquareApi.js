'use strict';

var _ = require('underscore');

var FOURSQUARE = 'Foursquare';
var OAUTH_TOKEN = 'RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ';
var API_VERSION = '20141020';
var BASE_URL_VENUE = 'https://api.foursquare.com/v2/venues/';
var IMAGE_SIZE = '500x500';
var FOOD_CATEGORY_ID = '4d4b7105d754a06374d81259';
var SEARCH_INTENT = 'browse';
var SEARCH_LIMIT = 10;

var RESTAURANT_CLASS = 'Restaurants';
var CARD_CLASS = 'Cards';

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

Parse.Cloud.define('foursquareSearch', function (request, response) {
  request.params.queryParams.categoryId = FOOD_CATEGORY_ID;
  request.params.queryParams.oauth_token = OAUTH_TOKEN;
  request.params.queryParams.v = API_VERSION;
  request.params.queryParams.intent = SEARCH_INTENT;
  request.params.queryParams.limit = SEARCH_LIMIT;

  Parse.Cloud.httpRequest({
    method: "GET",
    url: BASE_URL_VENUE + 'search',
    params: request.params.queryParams
  })
    .then(function (httpResponse) {
      var venuesResponse = JSON.parse(httpResponse.text).response.venues;
      return Parse.Promise.when(_.map(venuesResponse, function (venue) {
        return Parse.Cloud.run('foursquareVenue', {venueId: venue.id})
      }))
    })
    .then(function () {
      response.success(_.toArray(arguments));
    })
    .fail(function (error) {
      if (arguments.length > 1) {
        response.error(_.toArray(arguments));
      } else {
        response.error(error);
      }
    })

});

Parse.Cloud.define('foursquareVenue', function (request, response) {
  var venueId = request.params.venueId;
  if (!venueId) {
    response.error({message: 'foursquareVenue: Foursquare Venue ID is required.'});
  }

  Parse.Cloud.httpRequest({
    method: 'GET',
    url: BASE_URL_VENUE + venueId,
    params: {
      oauth_token: OAUTH_TOKEN,
      v: API_VERSION
    },
    success: parseVenueResponse,
    error: function (httpResponse) {
      response.error("Request failed with response code:" + httpResponse.status + " Message: " + httpResponse.text);
    }
  });

  function parseVenueResponse(httpResponse) {
    var venueResponse = transformVenueResponse(JSON.parse(httpResponse.text).response);
    cacheVenue(venueResponse)
      .then(function (venue) {
        response.success(venue);
      })
      .fail(function (error) {
        response.error(error);
      })
  }
});

Parse.Cloud.define('explore', function (request, response) {
  request.params.queryParams.venuePhotos = 1;
  request.params.queryParams.oauth_token = OAUTH_TOKEN;
  request.params.queryParams.v = API_VERSION;
  if (request.params.queryParams.query == '') {
    request.params.queryParams.section = 'food';
  }

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
    var items = apiResponse.groups[0].items;
    var venues = items.map(transformVenueResponse);

    // For caching to work, it must be done before returning the response
    cacheVenues(venues)
      .then(function (cards) {
        response.success(cards);
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

function cacheVenue(venue) {
  var query = new Parse.Query(RESTAURANT_CLASS);
  return query
    .equalTo('foursquareId', venue.foursquareId)
    .first()
    .then(function (existingRestaurant) {
      return existingRestaurant ? getCard(existingRestaurant) : saveRestaurant(venue);
    });
}

function cacheVenues(venues) {
  return Parse.Promise.when(venues.map(cacheVenue))
    .then(function () {
      return _.toArray(arguments);
    });
}

function getCard(restaurant) {
  var query = new Parse.Query(CARD_CLASS);
  return query.equalTo('taggedRestaurant', restaurant)
    .equalTo('externalSource', FOURSQUARE)
    .include('taggedRestaurant')
    .first();
}

function saveRestaurant(venue) {
  var Restaurant = Parse.Object.extend(RESTAURANT_CLASS);
  var newRestaurant = new Restaurant();
  return newRestaurant.save(venue)
    .then(function (restuarant) {
      newRestaurant = restuarant;
      return restaurant;
    })
    .then(createFoursquareCard)
    .then(function (card) {
      card.set('taggedRestaurant', newRestaurant);
      return card;
    });
}

function createFoursquareCard(restaurant) {
  var Card = Parse.Object.extend(CARD_CLASS);
  var card = new Card();
  return card.save({
    taggedRestaurant: restaurant,
    externalSource: FOURSQUARE
  })
    .fail(function () {
      return {message: 'Cannot save new card: ' + restaurant.get('name')};
    });
}

//Parse.Cloud.job('createFSQCards', function (request, status) {
//  var cardsQuery = new Parse.Query('Cards');
//  var restaurantQuery = new Parse.Query('Restaurants');
//  cardsQuery
//    .equalTo('externalSource', 'Foursquare')
//    .find()
//    .then(function (cards) {
//      return Parse.Object.destroyAll(cards);
//    })
//    .then(function () {
//      return restaurantQuery.each(createFoursquareCard);
//    })
//    .then(function () {
//      status.success('Cards created!');
//    })
//    .fail(function (error) {
//      status.error(error);
//    });
//});