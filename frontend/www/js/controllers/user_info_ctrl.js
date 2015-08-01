(function() {
  var UserInfoCtrl = function($scope, $state, $timeout, Actions) {
    $scope.goToProfile = function() {
      $state.go('tab.profile', {});
    };
  }

  angular.module('kiwii').
    controller('UserInfoCtrl', UserInfoCtrl);
})();
