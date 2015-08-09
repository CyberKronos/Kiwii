(function () {
  var Lists = function () {
    var RESTAURANTS_CLASS = 'Restaurants';
    var RESTAURANT_ID_COLUMN = 'foursquareId';

    var LISTS_CLASS = 'Lists';
    var LISTS_ATTRIBUTE = 'lists';

    var getRestaurant = function (foursquareId) {
      var Restaurants = Parse.Object.extend(RESTAURANTS_CLASS);
      var restaurantQuery = new Parse.Query(Restaurants)
        .equalTo(RESTAURANT_ID_COLUMN, foursquareId);

      return restaurantQuery.find()
        .then(function (results) {
          console.log(results);
          return results[0];
        });
    };

    var getList = function (listData) {
      var List = Parse.Object.extend(LISTS_CLASS);
      var listQuery = new Parse.Query(List);

      return listQuery.get(listData.objectId)
        .then(function (result) {
          console.log(result);
          return result;
        });
    };

    /* Public Interface */
    return {
      saveList: function (listData) {
        var List = Parse.Object.extend(LISTS_CLASS);

        var saveList = new List();
        saveList.set('name', listData.name);
        saveList.set('description', listData.description);
        saveList.set('category', listData.category);
        saveList.set('categoryId', listData.categoryId);

        return saveList.save()
          .then(function () {
            var saveListRelation = Parse.User.current().relation(LISTS_ATTRIBUTE);
            saveListRelation.add(saveList);
            
            return Parse.User.current().save();
          });
      },
      editList: function(listData) {
        return getList(listData)
          .then(function (list) {
            list.set("name", listData.name);
            list.set("description", listData.description);
            list.set("category", listData.category);
            
            return list.save();
          });
      },
      saveRestaurantListRelation: function(list, foursquarePlaceId) {
        var restaurantListRelation = list.relation('restaurants');
        return getRestaurant(foursquarePlaceId)
          .then(function (restaurant) {
            console.log(restaurant);
            restaurantListRelation.add(restaurant);
            
            return list.save();
          });
      },
      removeRestaurantListRelation: function(list, foursquarePlaceId) {
        var restaurantListRelation = list.relation('restaurants');
        return getRestaurant(foursquarePlaceId)
          .then(function (restaurant) {
            console.log(restaurant);
            restaurantListRelation.remove(restaurant);
            
            return list.save();
          });
      }
    };
  };

  angular.module('kiwii')
    .factory('Lists', Lists);
})();