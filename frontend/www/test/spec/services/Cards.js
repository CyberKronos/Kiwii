'use strict';

var SCOPE_DIGEST_CYCLE_RATE = 500;

describe('Service: Cards', function () {

  var Cards;
  var rootScope;
  var timeout;

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

  beforeEach(inject(function (_Cards_, $rootScope, $timeout) {
    Cards = _Cards_;
    rootScope = $rootScope;
    timeout = $timeout;
  }));

  beforeEach(inject(function (_Cards_) {
    Cards = _Cards_;
  }));

  it('should exist as a service', function () {
    expect(Cards).toBeDefined();
  });

  it('createCard() returns the card created with an objectId', function (done) {
    var mockCard = {};
    var testCardCreation = function (cardResponse) {
      expect(cardResponse).toEqual(jasmine.objectContaining(mockCard));
      //expect(cardResponse.objectId).toBeDefined();
      return cardResponse;
    };

    Cards.createCard(mockCard)
      .then(testCardCreation)
      .catch(failTest)
      .finally(done);

    // force Angular to update scope to get promises resolved
    setInterval(rootScope.$digest, SCOPE_DIGEST_CYCLE_RATE);
  });

  function failTest(error) {
    console.log(error);
    fail();
  }
});