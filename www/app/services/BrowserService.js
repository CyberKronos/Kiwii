'use strict';
/**
 * @ngDoc service
 * @name ng.service:BrowserService
 * @description
 * Wrapper for cordovaInAppBrowser to open web pages.
 */
angular.module('kiwii')
  .factory('BrowserService', ['$cordovaInAppBrowser', function ($cordovaInAppBrowser) {
    return {
      open: openWebsite
    };

    function openWebsite(url) {
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };
      $cordovaInAppBrowser.open(url, '_blank', options);
    }
  }]);