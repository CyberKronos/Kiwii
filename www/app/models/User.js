(function () {
  var User = function ($q, ParseObject, Lists) {

    var USER_CLASS = '_User';
    var USER_KEYS = ['username', 'fbId', 'handle', 'firstname', 'lastname', 'email', 'fbPicture', 'verified', 
                     'uploadedPhotos', 'savedRestaurants', 'savedForLater', 'lists', 'searchHistory', 'selectedVenueHistory'];

    var User = ParseObject.extend(USER_CLASS, USER_KEYS, {}, {
      // Static Methods
      getCurrentUser: getCurrentUser,
      getUserById: getUserById
    });

    return User;

    /**
     * Gets the current authenticated user.
     * @returns {Promise} Angular promise that resolves to a User,
     *  rejects with a Parse.Error object.
     */
    function getCurrentUser() {
      return Parse.User.current();
    }

    /**
     * Gets a user by its id.
     * @param userId {String} the object id of the user.
     * @returns {Promise} Angular promise that resolves to a User,
     *  rejects with a Parse.Error object.
     */
    function getUserById(userId) {
      var deferred = $q.defer();
      var query = new Parse.Query(Parse.User);
      query.equalTo('objectId', userId)
        .find()
        .then(deferred.resolve)
        .fail(deferred.reject);
      return deferred.promise;
    }
  };

  angular.module('kiwii')
    .factory('User', ['$q', 'ParseObject', User]);
})();