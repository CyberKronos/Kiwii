(function () {
  angular.module('kiwii')
    .factory('ViewedHistory', ['$q', 'ParseObject', 'Cards', 'FoursquareApi', function ($q, ParseObject, Cards, FoursquareApi) {

      var VIEWED_HISTORY_KEYS = ['user', 'restaurant', 'card'];
      var VIEWED_HISTORY_CLASS = 'ViewedHistory';

      var RECORD_RETRIEVAL_LIMIT = 10;

      function resolveRestaurant(params) {
        if (params['restaurantId']) {
          var Restaurant = Parse.Object.extend('Restaurant');
          return $q.when(Restaurant.createWithoutData(params['restaurantId']));
        }
        else if (params['foursquareId']) {
          return FoursquareApi.getRestaurantById(params['foursquareId'])
        } else {
          return $q.reject({message: 'No Restaurant ID was provided to record viewed history.'});
        }
      }

      function saveRecord(user, restaurant, card) {
        var ViewedHistory = Parse.Object.extend(VIEWED_HISTORY_CLASS);
        var newRecord = new ViewedHistory();

        return getRecord(user, restaurant, card)
          .then(function (previousRecord) {
            return previousRecord ? previousRecord.save() :
              newRecord.save({user: user, restaurant: restaurant, card: card});
          })
      }

      function getRecord(user, restaurant, card) {
        var query = new Parse.Query(VIEWED_HISTORY_CLASS);
        return query.equalTo('user', user)
          .equalTo('restaurant', restaurant)
          .equalTo('card', card)
          .first();
      }

      var ViewedHistory = ParseObject.extend(VIEWED_HISTORY_CLASS, VIEWED_HISTORY_KEYS, {}, {
        record: record,
        retrieveRecentRestaurants: retrieveRecentRestaurants
      });

      function record(userId, params) {
        var deferred = $q.defer();

        resolveRestaurant(params)
          .then(function (restaurant) {
            var card;
            if (params['cardId']) {
              card = Cards.createWithoutData(params['cardId']);
            }
            var user = Parse.User.createWithoutData(userId);
            return saveRecord(user, restaurant, card);
          })
          .then(deferred.resolve)
          .fail(deferred.reject);

        return deferred.promise;
      }

      function retrieveRecentRestaurants(userId) {
        var deferred = $q.defer();
        var user = Parse.User.createWithoutData(userId);
        var query = new Parse.Query(VIEWED_HISTORY_CLASS);
        query
          .equalTo('user', user)
          .addDescending('updatedAt')
          .include('restaurant')
          .limit(RECORD_RETRIEVAL_LIMIT)
          .find()
          .then(function (result) {
            return _.pluck(result, 'restaurant');
          })
          .then(deferred.resolve)
          .fail(deferred.reject);
        return deferred.promise;
      }

      return ViewedHistory;
    }])
})();