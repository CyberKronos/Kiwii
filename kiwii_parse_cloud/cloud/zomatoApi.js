'use strict';

var _ = require('underscore');

var USER_KEY = 'b6e186970ffea9461d9c4927ce1fbe0f';
var BASE_URL = 'https://developers.zomato.com/api/v2.1/';
var COLLECTION_LIMIT = 8;

// Zomato Api
Parse.Cloud.define("findCollections", function (request, response) {
  request.params.queryParams.count = COLLECTION_LIMIT;

  Parse.Cloud.httpRequest({
    method: "GET",
    headers: {
      'user_key': USER_KEY
    },
    url: BASE_URL + 'collections',
    params: request.params.queryParams,
    success: findRestaurants,
    error: function (httpResponse) {
      response.error("Request failed with response code:" + httpResponse.status + " Message: " + httpResponse.text);
    }
  });

  function findRestaurants(httpResponse) {
    var responseBody = JSON.parse(httpResponse.text);

    var lat = request.params.queryParams.lat;
    var lon = request.params.queryParams.lon;

    var items = _.map(responseBody.collections, function (item) {
      var collectionId = item.collection.collection_id;

      var p1 = getCollectionRestaurants(lat, lon, collectionId)
        .then(function (result) {
          var restaurants = JSON.parse(result.text);
          item.collection.restaurants = restaurants.restaurants;
        });

      return Parse.Promise.when(p1)
        .then(function () {
          return item;
        });
    });

    return Parse.Promise.when(items)
      .then(function() {
        response.success(responseBody);
      });
  }
});

function getCollectionRestaurants(lat, lon, collectionId) {
  var queryParams = {
    "lat": lat,
    "lon": lon,
    "collection_id": collectionId
  }

  return Parse.Cloud.httpRequest({
    method: "GET",
    headers: {
      'user_key': USER_KEY
    },
    url: BASE_URL + 'search',
    params: queryParams,
    success: function (httpResponse) {
      return httpResponse;
    },
    error: function (httpResponse) {
      return "Request failed with response code:" + httpResponse.status + " Message: " + httpResponse.text;
    }
  });
}