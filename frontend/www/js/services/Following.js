(function () {
  var Following = function () {
    var USER_FOLLOWING_ATTRIBUTE = 'following';

    /* Public Interface */
    return {
      followUser: function(userObject) {
        var followingRelation = Parse.User.current().relation(USER_FOLLOWING_ATTRIBUTE);
        followingRelation.add(userObject);
        // var currentUser = Parse.User.current();
        // Parse.Cloud.run('addRestaurantToListActivity', {
        //   feed: 'user:' + currentUser.id,
        //   actor: 'ref:' + currentUser.className + ':' + currentUser.id,
        //   object: 'ref:' + restaurant.className + ':' + restaurant.id,
        //   foreign_id: restaurant.id + list.id,
        //   target: 'ref:' + list.className + ':' + list.id
        // }).then(function (response) {
        //   console.log(response);
        // });
        return Parse.User.current().save();
      },
      unfollowUser: function(userObject) {
        var followingRelation = Parse.User.current().relation(USER_FOLLOWING_ATTRIBUTE);
        followingRelation.remove(userObject);
        // var currentUser = Parse.User.current();
        // Parse.Cloud.run('removeRestaurantFromListActivity', {
        //   feed: 'user:' + currentUser.id,
        //   foreign_id: restaurant.id + list.id
        // }).then(function (response) {
        //   console.log(response);
        // });
        return Parse.User.current().save();
      }
    };
  };

  angular.module('kiwii')
    .factory('Following', Following);
})();