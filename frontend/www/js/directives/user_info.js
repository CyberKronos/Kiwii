(function() {
  var userInfo = function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/user_info.html',
      replace: true,
      controller: 'UserInfoCtrl'
    }
  }

  angular.module('kiwii').
    directive('userInfo', userInfo);
})();
