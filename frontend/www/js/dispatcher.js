(function() {
  var Dispatcher = function(FluxUtil) {
    return FluxUtil.createDispatcher();
  }

  angular.module('kiwii')
    .factory('Dispatcher', Dispatcher)
})();
