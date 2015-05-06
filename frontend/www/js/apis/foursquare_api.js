(function() {
  var FoursquareApi = function($http) {
    /* Private Methods */
    var OAUTH_TOKEN = 'RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ';

    /* Public Interface */
    return {
      getRestaurantReviews: function(foursquareId) {
        var endpointUrl = 'https://api.foursquare.com/v2/venues/' + foursquareId + '/tips?oauth_token=' + OAUTH_TOKEN + '&v=20141020';
        
        return Parse.Cloud.run('callFoursquareApi', { url: endpointUrl })
        .then(function(response) {
          var tips = response.data.response.tips.items;
          console.log(tips);
          return tips;
        });
      }
    }
  }

  angular.module('app').
    factory('FoursquareApi', FoursquareApi)
})();
