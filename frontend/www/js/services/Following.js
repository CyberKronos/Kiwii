(function () {
  var Following = function () {
    var USER_FOLLOWING_ATTRIBUTE = 'following';

    /* Public Interface */
    return {
      followUser: function(userObject) {
        var followingRelation = Parse.User.current().relation(USER_FOLLOWING_ATTRIBUTE);
        followingRelation.add(userObject);
        var currentUser = Parse.User.current();
        return Parse.Cloud.run('follow', {
          feed: 'user:' + currentUser.id,
          actor: 'ref:' + currentUser.className + ':' + currentUser.id,
          actor_id: currentUser.id,
          object: 'ref:' + userObject.className + ':' + userObject.id,
          object_id: userObject.id,
          foreign_id: userObject.id + currentUser.id
        }).then(function (response) {
          console.log(response);
          return Parse.User.current().save();
        });
      },
      unfollowUser: function(userObject) {
        var followingRelation = Parse.User.current().relation(USER_FOLLOWING_ATTRIBUTE);
        followingRelation.remove(userObject);
        var currentUser = Parse.User.current();
        return Parse.Cloud.run('unfollow', {
          feed: 'user:' + currentUser.id,
          actor_id: currentUser.id,
          object_id: userObject.id,
          foreign_id: userObject.id + currentUser.id
        }).then(function (response) {
          console.log(response);
          return Parse.User.current().save();
        });
      }
    };
  };

  angular.module('kiwii')
    .factory('Following', Following);
})();