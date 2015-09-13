(function () {
  var InstagramApi = function ($q) {
    /* Private Methods */
    function convertToKiwiiFormat(instagramObject) {
      var description = '';
      if (instagramObject.caption) {
        description = instagramObject.caption.text;
      }
      return {
        photo: {
          url: instagramObject.images.standard_resolution.url,
          name: instagramObject.location.name
        },
        description: description,
        likes: instagramObject.likes.count,
        commentsCount: instagramObject.comments.count,
        externalSource: 'instagram'
      };
    }

    /* Public Interface */
    return {
      getLocationImages: function (foursquareId) {
        var deferred = $q.defer();
        Parse.Cloud.run('getInstagramImagesByFoursquareId', {foursquareId: foursquareId})
          .then(function (response) {
            if (response) {
              return deferred.resolve(_.map(response.data, convertToKiwiiFormat));
            } else {
              return deferred.resolve([]);
            }
          })
          .fail(deferred.reject);
        return deferred.promise;
      }
    }
  };

  angular.module('kiwii').
    factory('InstagramApi', InstagramApi)
})();
