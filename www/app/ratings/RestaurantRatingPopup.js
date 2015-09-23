(function () {
  var RestaurantRatingPopup = function ($ionicPopup, $rootScope, $q,  Ratings) {

    return {
      askForRating: askForRating
    };

    function askForRating(restaurantId, userId) {
      var deferred = $q.defer();
      return Ratings.getRating(restaurantId, userId)
        .then(function (rating) {
          deferred.notify(rating);
          return rating;
        })
        .then(show)
        .then(_.method('save'))
        .then(function (rating) {
          deferred.resolve(rating);
        });
    }

    function show(restaurantRating) {
      var scope = $rootScope.$new();
      scope.rating = restaurantRating || {score: 5};
      return $ionicPopup.show({
        templateUrl: 'app/ratings/restaurant_rating_popup.html',
        title: 'Rate This Restaurant!',
        subTitle: 'Which side are you closer to?',
        scope: scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Submit',
            type: 'button-positive',
            onTap: function () {
              scope.rating.score = Number(scope.rating.score);
              return scope.rating;
            }
          }
        ]
      })
    }
  };

  angular.module('kiwii')
    .factory('RestaurantRatingPopup', ['$ionicPopup', '$rootScope', '$q', 'Ratings', RestaurantRatingPopup]);

})();