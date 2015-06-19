(function() {
  var UserInfoCtrl = function($scope, $state, $timeout, Actions) {
    $scope.goToProfile = function() {
      $state.go('profile', {});
    };
  }

  angular.module('kiwii').
    controller('UserInfoCtrl', UserInfoCtrl);
})();
