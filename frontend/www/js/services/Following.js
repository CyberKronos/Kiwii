(function () {
  var Following = function () {
    var FOLLOW_CLASS = 'Follow';

    var Activity = Parse.Object.extend("Activity");
    var Follow = Activity.extend("Follow");

    var getFollowingList = function(userData) {
      var Follow = Parse.Object.extend(FOLLOW_CLASS);
      var followQuery = new Parse.Query(Follow);

      var user = userData;

      followQuery.equalTo("actor", {
        __type: "Pointer",
        className: "_User",
        objectId: user.id
      });

      followQuery.include("actor");
      followQuery.include("object");

      return followQuery.find()
        .then(function (result) {
          return result;
        }, function (error) {
          return error;
        });
    };

    var getFollowerList = function(userData) {
      var Follow = Parse.Object.extend(FOLLOW_CLASS);
      var followQuery = new Parse.Query(Follow);

      var user = userData;

      followQuery.equalTo("object", {
        __type: "Pointer",
        className: "_User",
        objectId: user.id
      });

      followQuery.include("actor");
      followQuery.include("object");

      return followQuery.find()
        .then(function (result) {
          return result;
        }, function (error) {
          return error;
        });
    };

    var getFollowRelationship = function (userData) {
      var Follow = Parse.Object.extend(FOLLOW_CLASS);
      var followQuery = new Parse.Query(Follow);

      var currentUser = Parse.User.current();

      followQuery.equalTo("actor", {
        __type: "Pointer",
        className: "_User",
        objectId: currentUser.id
      });

      followQuery.equalTo("object", {
        __type: "Pointer",
        className: "_User",
        objectId: userData.id
      });

      return followQuery.find()
        .then(function (result) {
          return result[0];
        }, function (error) {
          return error;
        });
    };

    /* Public Interface */
    return {
      followRelationship: function(userData) {
        return getFollowRelationship(userData)
          .then(function (result) {
            return result;
          });
      },
      followUser: function(userObject) {
        return getFollowRelationship(userObject)
          .then(function (result){
            if (result == undefined) {
              var query = new Parse.Query(Parse.User);
              var follow = new Follow();
              var currentUser = Parse.User.current();

              // configure which feed to write to
              follow.set('feedSlug', 'user');
              follow.set('feedUserId', currentUser.id);
              
              return follow.save(
                {
                  actor : currentUser,
                  verb : 'follow',
                  object : userObject
                }
              ).then(function(result){
                console.log(result);
                return result;
              }, function(error) {
                console.log(error);
                return error;
              });
            } else {
              return 'You are already following this user';
            }
          }, function (error) {
            console.log(error);
          });
      },
      unfollowUser: function(userObject) {
        return getFollowRelationship(userObject)
          .then(function (result) {
            return result.destroy();
          });
      },
      followingList: function(userData) {
        return getFollowingList(userData)
          .then(function (result){
            console.log(result);
            return result;
          });
      },
      followerList: function(userData) {
        return getFollowerList(userData)
          .then(function (result){
            console.log(result);
            return result;
          });
      }
    };
  };

  angular.module('kiwii')
    .factory('Following', Following);
})();