'use strict';

var _ = require('underscore');

Parse.Cloud.afterSave('Restaurants', function (request, response) {
  updateGeoPoint(request.object);
  indexName(request.object);
  response.success();
});

function updateGeoPoint(restaurant) {
  var location = restaurant.get('location');
  if (location && location.lat && location.lng) {
    var geoPoint = new Parse.GeoPoint(location.lat, location.lng);
    restaurant.set('geoPoint', geoPoint);
  }
}

function indexName(restaurant) {
  var name = restaurant.get('name');

  // Adopted from http://blog.parse.com/learn/engineering/implementing-scalable-search-on-a-nosql-backend/
  var toLowerCase = function (w) {
    return w.toLowerCase();
  };

  var hasNoStopWords = function (w) {
    var stopWords = ["the", "in", "and"];
    return !_.contains(stopWords, w);
  };

  var words = name.match(/\S+/g);

  words = _.map(words, toLowerCase);
  words = _.filter(words, hasNoStopWords);

  var prefixIndex = generateAllPrefixes(words);
  restaurant.set('nameIndex', prefixIndex);
}

function generateAllPrefixes(words) {
  var prefixes = [];
  _.map(words, function (word) {
    var acc = '';
    _.map(word, function (char) {
      acc += char;
      uniqueInsert(prefixes, acc);
    });
  });
  return prefixes;
}

function uniqueInsert(array, e) {
  var i = _.sortedIndex(array, e);
  if (array[i] !== e) {
    array.splice(i, 0, e);
  }
}

//Parse.Cloud.job('migrateRestaurantData', function (request, status) {
//  var query = new Parse.Query('Restaurants');
//  query.each(function (restaurant) {
//    updateGeoPoint(restaurant);
//    indexName(restaurant);
//    return restaurant.save();
//  })
//    .then(function () {
//      status.success('Migration Complete');
//    }, function (error) {
//      status.error(error);
//    });
//});