'use strict';

/**
 * @ngDoc controller
 * @name ng.controller:GlobalCtrl
 * @description
 * Adds common functions that all controllers in Kiwii will inherit.
 */
angular.module('kiwii')
  .controller('GlobalCtrl', ['$scope', '$rootScope', '$state', '$cordovaInAppBrowser',
    function ($scope, $rootScope, $state, $cordovaInAppBrowser) {
      $scope.$state = $state;

      $scope.openWebsite = function (link) {
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'yes'
        };
        $cordovaInAppBrowser.open(link, '_blank', options);
      };
    }]);