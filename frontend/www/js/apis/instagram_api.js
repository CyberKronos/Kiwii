(function () {
  var InstagramApi = function () {
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
        return Parse.Cloud.run('searchLocation', {foursquareId: foursquareId})
          .then(function (response) {
            var id = response.data[0].id;
            return Parse.Cloud.run('getRecentMediaByLocation', {locationId: id});
          })
          .then(function (response) {
            var images = response.data;
            images = _.map(images, convertToKiwiiFormat);
            console.log(images);
            return images;
          });
      }
    }
  };

  angular.module('kiwii').
    factory('InstagramApi', InstagramApi)
})();
