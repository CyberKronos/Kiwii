(function () {
  var FacebookApi = function ($q, $cordovaFacebook) {
    /* Private Methods */

    /* Public Interface */
    return {
      getFriendsInApp: function () {
        if (!window.cordova) {
          var appId = 1597756577154303;
          facebookConnectPlugin.browserInit(appId);
        }
        return $cordovaFacebook.getLoginStatus()
          .then(function (success) {
            console.log(success);
            return $cordovaFacebook.api("/me/friends", ["public_profile", "user_friends"])
          })
          .catch(function (error) {
            console.log(error);
            return $q.reject(error);
          })
      },
      getUserByFbId: function (fbId) {
        var query = new Parse.Query(Parse.User);
        return query.equalTo('fbId', fbId).first()
          .then(function (user) {
            return user ? $q.when(user) : $q.reject({message: 'User not found'});
          })
          .fail($q.reject);
      }
    }
  };

  angular.module('kiwii')
    .factory('FacebookApi', ['$q', '$cordovaFacebook', FacebookApi]);
})();