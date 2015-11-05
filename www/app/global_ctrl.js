'use strict';

/**
 * @ngDoc controller
 * @name ng.controller:GlobalCtrl
 * @description
 * Adds common functions that all controllers in Kiwii will inherit.
 */
angular.module('kiwii')
  .controller('GlobalCtrl', ['$scope', '$state', '$cordovaInAppBrowser', 'RestaurantDetails',
    function ($scope, $state, $cordovaInAppBrowser, RestaurantDetails) {
      $scope.$state = $state;

      $scope.goToMaps = function (id) {
        $state.go('maps', {venueId: id});
      };

      $scope.goToPhotos = function (id) {
        $state.go('photos', {venueId: id});
      };

      $scope.openWebsite = function (link) {
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'yes'
        };
        $cordovaInAppBrowser.open(link, '_blank', options);
      };
    }]);