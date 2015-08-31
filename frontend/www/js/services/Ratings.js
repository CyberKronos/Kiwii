(function () {
  var Ratings = function ($q, ParseObject, FoursquareApi, FacebookApi) {

    var RATINGS_KEYS = ['restaurant', 'user', 'score'];

    Ratings = ParseObject.extend('Ratings', RATINGS_KEYS, {
      // Instance Methods
      initialize: function (attrs, options) {
        var self = this;
        self.saveRating = function (attributes, options) {
          return self.save(attributes, options)
            .then($q.when)
            .fail($q.reject);
        }
      }
    }, {
      // Class Methods
      getRating: getRating
    });

    return Ratings;

    function getRating(restaurantId, userId) {
      return $q.all({
        restaurant: FoursquareApi.getRestaurantById(restaurantId),
        user: FacebookApi.getUserByFbId(userId)
      })
        .then(function (fetched) {
          return getRatingByParseObject(fetched.restaurant, fetched.user);
        });
    }

    function getRatingByParseObject(restaurant, user) {
      var query = new Parse.Query('Ratings');
      return query
        .equalTo('restaurant', restaurant)
        .equalTo('user', user)
        .first()
        .then(function (rating) {
          return $q.when(rating ? rating :
            new Ratings({restaurant: restaurant, user: user}));
        })
        .fail($q.reject);
    }

    //function getUserByFbId(fbId) {
    //  var query = new Parse.Query(Parse.User);
    //  return query.equalTo('fbId', fbId).first()
    //    .then(function (user) {
    //      return user ? $q.when(user) : $q.reject({message: 'User not found'});
    //    })
    //    .fail($q.reject);
    //}
  };

  angular.module('kiwii')
    .factory('Ratings', ['$q', 'ParseObject', 'FoursquareApi', 'FacebookApi', Ratings]);
})();