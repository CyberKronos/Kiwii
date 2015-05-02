(function() {
  var InstagramApi = function($rootScope, $http) {
    /* Private Methods */

    /* Public Interface */
    return {
      getLocationImages: function(foursquareId) {
        Parse.Cloud.run('searchLocation', { foursquareId: foursquareId })
        .then(function(response) {
          var id = response.data[0].id;
          return Parse.Cloud.run('getRecentMediaByLocation', { locationId: id }); 
        })
        .then(function(response) {
          var images = response.data;
          console.log(images);
          $rootScope.instagramImages = images;   
        });
      }
    }
  }

  angular.module('app').
    factory('InstagramApi', InstagramApi)
})();
