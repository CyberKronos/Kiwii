(function () {
  var Cards = function ($q) {

    return {
      createCard: createCard,
      getCards: getCards
    };

    function createCard(cardData) {
      var Card = Parse.Object.extend('Cards');
      var card = new Card(cardData);
      var deferred = $q.defer();
      card.save({
        success: function (card) {
          console.log('success');
          return deferred.resolve(card);
        },
        error: function (error) {
          console.log('error');
          return deferred.reject(error);
        }
      });
      return deferred.promise;
    }

    function getCards(options) {
      return $q.when({});
    }
  };

  angular.module('kiwii')
    .factory('Cards', ['$q', Cards]);
})();