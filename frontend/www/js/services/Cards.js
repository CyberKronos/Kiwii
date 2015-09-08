(function () {
  var Cards = function ($q, FoursquareApi, UserPhotos) {

    // Private Methods
    function createUserPhotos(cardData) {
      var createdUserPhotos = _.map(cardData['userPhotos'], UserPhotos.savePhoto);
      return Parse.Promise.when(createdUserPhotos)
        .then(function () {
          cardData['userPhotos'] = _.toArray(arguments);
          return cardData;
        })
        .fail(function () {
          var errors = _.toArray(arguments);
          return Parse.Promise.error(errors);
        });
    }

    return {
      // Public Methods
      createCard: createCard,
      getCardById: getCardById,
      getUserCards: getUserCards
    };

    /**
     * Creates card and returns a JSON representation of the created Parse Object.
     * @param cardData {Object} attributes are:
     *  userPhotos {Array<Object>} - list of user photo objects to be created
     *  author {Parse.User} - the user who is creating this card
     *  taggedRestaurant {String} - foursquare id of the associated restaurant of the card
     * @returns {Promise} Angular promise that resolves to a new Card,
     *  rejects with a Parse.Error object.
     */
    function createCard(cardData) {
      var deferred = $q.defer();
      var Card = Parse.Object.extend('Cards');
      var card = new Card();
      card.set('author', cardData['author']);

      FoursquareApi.getRestaurantById(cardData['taggedRestaurant'])
        .then(function (restaurant) {
          card.set('taggedRestaurant', restaurant);
          return cardData;
        })
        .then(createUserPhotos)
        .then(function (cardData) {
          var userPhotosRelation = card.relation('userPhotos');
          userPhotosRelation.add(cardData['userPhotos']);
          return card.save();
        })
        .then(function (card) {
          return deferred.resolve(card);
        })
        .fail(function (error) {
          return deferred.reject('Unable to create a new card: ' + error.message);
        });
      return deferred.promise;
    }

    /**
     * Gets the a cards created by its id.
     * @param cardId {String} the object id of the card.
     * @returns {Promise} Angular promise that resolves to a Card,
     *  rejects with a Parse.Error object.
     */
    function getCardById(cardId) {
      var query = new Parse.Query('Cards');
      var deferred = $q.defer();
      query.get(cardId)
        .then(function (card) {
          return deferred.resolve(card);
        })
        .fail(function (error) {
          return deferred.reject(error);
        });
      return deferred.promise;
    }

    /**
     * Gets the list of cards created by the user.
     * @param userId {String} usually the Facebook ID of the user
     * @returns {Promise} Angular promise that resolves to a list of Cards,
     *  rejects with a Parse.Error object.
     */
    function getUserCards(userId) {
      var deferred = $q.defer();
      var query = new Parse.Query('Cards');
      query.equalTo('author', Parse.User.createWithoutData(userId))
        .find()
        .then(deferred.resolve)
        .fail(deferred.reject);
      return deferred.promise;
    }
  };

  angular.module('kiwii')
    .factory('Cards', ['$q', 'FoursquareApi', 'UserPhotos', Cards]);
})();