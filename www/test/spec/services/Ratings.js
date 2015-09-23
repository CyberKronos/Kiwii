'use strict';
ASYNC_TIMEOUT = 10000;

fdescribe('Service: Ratings', function () {

  var Ratings;
  var rootScope;
  var timeout;

  var testUsersIds = ['1452789918376599', '10155920083365057'];
  var testRestaurantIds = ['4aa9aa1af964a520c25420e3', '5210a1e2498e7c57f84143f3'];

  beforeEach(function () {
    module('kiwii')
  });

  // Prevent ui.router and ionic template cache from interfering $httpBackend
  // https://github.com/angular-ui/ui-router/issues/212
  beforeEach(module(function ($provide) {
    $provide.value('$ionicTemplateCache', function () {
    });
  }));
  beforeEach(module(function ($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_Ratings_, $rootScope, $timeout) {
    Ratings = _Ratings_;
    rootScope = $rootScope;
    timeout = $timeout;
  }));

  it('getRating() creates a new rating if an old one does not exist.', function (done) {
    kiwiiTest.simulateDigestCycle(rootScope);
    function testRating(rating) {
      expect(rating).toBeDefined();
      expect(rating.restaurant).toBeDefined();
      expect(rating.user).toBeDefined();
      expect(rating.score).not.toBeDefined();
    }

    Ratings.getRating(testRestaurantIds[0], testUsersIds[0])
      .then(testRating)
      .then(_.bind(Ratings.getRating, this, testRestaurantIds[0], testUsersIds[1]))
      .then(testRating)
      .then(done)
      .catch(failTest);

  }, ASYNC_TIMEOUT);

  it('saveRating() can save a new rating.', function (done) {
    kiwiiTest.simulateDigestCycle(rootScope);
    var setScore;

    Ratings.getRating(testRestaurantIds[1], testUsersIds[0])
      .then(function (newRating) {
        newRating.score = Number((Math.random() * 10).toFixed());
        setScore = newRating.score;
        return newRating.saveRating();
      })
      .then(testRatingExists)
      .then(done)
      .catch(failTest);

    function testRatingExists(rating) {
      expect(rating).toBeDefined();
      console.log(rating);
      expect(rating.restaurant).toBeDefined();
      expect(rating.user).toBeDefined();
      expect(rating.score).toEqual(setScore);
    }
  }, ASYNC_TIMEOUT);

  function failTest(error) {
    console.log(error);
    fail();
  }
});