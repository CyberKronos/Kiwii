(function () {
  angular.module('kiwii')
    .factory('ViewedHistory', ['$q', 'ParseObject', 'Cards', 'FoursquareApi', function ($q, ParseObject, Cards, FoursquareApi) {

      var VIEWED_HISTORY_KEYS = ['user', 'restaurant', 'card'];
      var VIEWED_HISTORY_CLASS = 'ViewedHistory';

      var RECORD_RETRIEVAL_LIMIT = 10;

      function resolveRestaurant(params) {
        var deferred = $q.defer();
        if (params['restaurantId']) {
          var Restaurant = Parse.Object.extend('Restaurant');
          deferred.resolve(Restaurant.createWithoutData(params['restaurantId']));
        }
        else if (params['foursquareId']) {
          deferred.resolve(FoursquareApi.getRestaurantById(params['foursquareId']));
        } else {
          deferred.resolve({message: 'No Restaurant ID was provided to record viewed history.'});
        }
        return deferred.promise;
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

      function fetchFullRecord(record) {
        var deferred = $q.defer();
        if (record.card) {
          var query = new Parse.Query(Cards);
          query
            .include('author')
            .include('photos')
            .get(record.card.id)
            .then(function (card) {
              record.card = card;
              deferred.resolve(record);
            });
        } else {
          deferred.resolve(record);
        }
        return deferred.promise;
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
          .catch(deferred.reject);

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
          .include('card')
          .limit(RECORD_RETRIEVAL_LIMIT)
          .find()
          .then(function (result) {
            return Parse.Promise.when(_.map(result, fetchFullRecord));
          })
          .then(function () {
            deferred.resolve(_.toArray(arguments));
          })
          .fail(function () {
            deferred.reject(_.toArray(arguments));
          });
        return deferred.promise;
      }

      return ViewedHistory;
    }])
})();