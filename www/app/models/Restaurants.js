(function () {
  angular.module('kiwii')
    .factory('Restaurants', ['$q', 'ParseObject',
      function ($q, ParseObject) {

        var RESTAURANTS_CLASS = 'Restaurants';
        var RESTAURANTS_KEYS = ['foursquareId', 'name', 'rating', 'hours', 'url', 'location', 'imageUrl', 'category', 'geoPoint', 'reservations', 'tips'];

        var Restaurants = ParseObject.extend(RESTAURANTS_CLASS, RESTAURANTS_KEYS, {}, {});

        return Restaurants;
      }]);
})();