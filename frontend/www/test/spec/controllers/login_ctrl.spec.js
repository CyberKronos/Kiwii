'use strict';

describe('Controller: LoginCtrl', function() {
  var controller;
  var scope;

  beforeEach(function() {
    module('kiwii');
  });

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    controller = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should have an existing controller', function() {
    expect(controller).toBeDefined();
  });

});