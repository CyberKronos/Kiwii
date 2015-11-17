angular.module('kiwii')
  .factory('SavedForLater', ['$q', 'User', 'Lists', function ($q, User, Lists) {

    var savedForLaterPromise = getSavedForLaterList();

    return {
      get: function () {
        return savedForLaterPromise;
      }
    };

    function getSavedForLaterList() {
      var user = User.current();
      var savedForLaterList = user.attributes.savedForLater;

      // Check if default favourite list exists
      var deferred = $q.defer();

      if (!savedForLaterList) {
        var newList = new Parse.Object('Lists');
        newList.set('name', 'Saved for Later');
        user.set('savedForLater', newList);
        user.save()
          .then(function (user) {
            return user.get('savedForLater');
          })
          .then(deferred.resolve)
          .fail(deferred.reject);
      } else {
        var query = new Parse.Query('Lists');
        query.get(savedForLaterList.id)
          .then(deferred.resolve)
          .fail(deferred.reject);
      }
      return deferred.promise;
    }
  }]);