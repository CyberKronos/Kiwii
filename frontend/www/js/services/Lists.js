(function () {
  var Lists = function (FoursquareApi) {
    var LISTS_CLASS = 'Lists';
    var LISTS_ATTRIBUTE = 'lists';

    var getList = function (listData) {
      var List = Parse.Object.extend(LISTS_CLASS);
      var listQuery = new Parse.Query(List);

      return listQuery.get(listData.objectId)
        .then(function (result) {
          console.log(result);
          return result;
        });
    };

    var getRestaurantsInList = function (list) {
      var relation = list.relation('restaurants');
      var query = relation.query();
      return query.find();
    };

    var updateThumbnailUrl = function (list) {
      return getRestaurantsInList(list)
        .then(function (restaurants) {
          if (restaurants.length > 0) {
            var firstRestaurantImage = restaurants[0].get('imageUrl');
            list.set('thumbnailUrl', firstRestaurantImage);
          } else {
            list.set('thumbnailUrl', undefined);
          }
          return list;
        });
    };

    /* Public Interface */
    return {
      saveList: function (listData) {
        var List = Parse.Object.extend(LISTS_CLASS);

        var saveList = new List();
        var user = Parse.User.current();
        // we write to the user feed
        saveList.set('feedSlug', 'user');
        saveList.set('feedUserId', user.id);
        // the list's data
        saveList.set('actor', user);
        saveList.set('verb', 'list');
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
      editList: function (listData) {
        return getList(listData)
          .then(function (list) {
            list.set("name", listData.name);
            list.set("description", listData.description);
            list.set("category", listData.category);

            return list.save();
          });
      },
      removeList: function (listData) {
        return getList(listData)
          .then(function (list) {
            return list.destroy();
          });
      },
      saveRestaurantListRelation: function (list, foursquarePlaceId) {
        var restaurantListRelation = list.relation('restaurants');
        return FoursquareApi.getRestaurantById(foursquarePlaceId)
          .then(function (restaurant) {
            console.log(restaurant);
            restaurantListRelation.add(restaurant);

            var currentUser = Parse.User.current();
            Parse.Cloud.run('addRestaurantToListActivity', {
              feed: 'user:' + currentUser.id,
              actor: 'ref:' + currentUser.className + ':' + currentUser.id,
              object: 'ref:' + restaurant.className + ':' + restaurant.id,
              foreign_id: restaurant.id + list.id,
              target: 'ref:' + list.className + ':' + list.id
            }).then(function (response) {
              console.log(response);
            });
            return list;
          })
          .then(_.method('save'))
          .then(updateThumbnailUrl)
          .then(_.method('save'));
      },
      removeRestaurantListRelation: function (list, foursquarePlaceId) {
        var restaurantListRelation = list.relation('restaurants');
        return FoursquareApi.getRestaurantById(foursquarePlaceId)
          .then(function (restaurant) {
            console.log(restaurant);
            restaurantListRelation.remove(restaurant);

            var currentUser = Parse.User.current();
            Parse.Cloud.run('removeRestaurantFromListActivity', {
              feed: 'user:' + currentUser.id,
              foreign_id: restaurant.id + list.id
            }).then(function (response) {
              console.log(response);
            });

            return list;
          })
          .then(_.method('save'))
          .then(updateThumbnailUrl)
          .then(_.method('save'));
      }
    };
  };

  angular.module('kiwii')
    .factory('Lists', Lists);
})();