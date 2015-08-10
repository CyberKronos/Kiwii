'use strict';

Parse.Cloud.beforeSave('Restaurants', function (request, response) {
  updateGeoPoint(request.object);
  response.success();
});

Parse.Cloud.job('migrateGeoPointData', function (request, status) {
  var query = new Parse.Query('Restaurants');
  query.each(function (restaurant) {
    updateGeoPoint(restaurant);
    return restaurant.save();
  })
    .then(function () {
      status.success('Migration Complete');
    }, function (error) {
      status.error(error);
    });
});

function updateGeoPoint(restaurant) {
  var location = restaurant.get('location');
  var geoPoint = new Parse.GeoPoint(location.lat, location.lng);
  restaurant.set('geoPoint', geoPoint);
}