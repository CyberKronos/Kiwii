(function() {
  var InstagramApi = function($http) {
    /* Private Methods */

    /* Public Interface */
    return {
      getLocationImages: function(foursquareId) {
        return Parse.Cloud.run('searchLocation', { foursquareId: foursquareId })
        .then(function(response) {
          var id = response.data[0].id;
          return Parse.Cloud.run('getRecentMediaByLocation', { locationId: id }); 
        })
        .then(function(response) {
          var images = response.data;
          console.log(images);
          return images;  
        });
      }
    }
  }

  angular.module('kiwii').
    factory('InstagramApi', InstagramApi)
})();
