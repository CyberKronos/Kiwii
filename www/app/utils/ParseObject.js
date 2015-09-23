'use strict';

angular.module('kiwii')
  .factory('ParseObject', [function () {
    return {
      extend: extend
    };

    /**
     * A wrapper for Parse.Object.extend that adds getter and setter properties
     * for the instances of the created  subclass. This makes it easier to use
     * with Angular templates.
     * @param className {String} The name of the Parse class backing this model.
     * @param keys {Array} List of keys to be added as getter and setter
     *    properties.
     * @param protoProps {Object} Instance properties to add to instances of
     *    the class returned from this method.
     * @param classProps {Object} Class properties to add the class returned
     *    from this method.
     * @returns {*}
     */
    function extend(className, keys, protoProps, classProps) {
      var ParseClass = Parse.Object.extend(className, protoProps, classProps);

      _.forEach(keys, function (keyName) {
        ParseClass.prototype.__defineGetter__(keyName, function () {
          return this.get(keyName);
        });
        ParseClass.prototype.__defineSetter__(keyName, function (aValue) {
          return this.set(keyName, aValue);
        });
      });

      return ParseClass;
    }
  }]);