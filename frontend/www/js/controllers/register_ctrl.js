(function() {
  var RegisterCtrl = function($scope, $state, $localStorage, Actions) {
    $scope.registerObj = {};
    $scope.emailRegister = function() {
        Actions.register($scope.registerObj.username, $scope.registerObj.firstname, $scope.registerObj.lastname, $scope.registerObj.email, $scope.registerObj.password)
        .then(function() {
            $state.go('intro');
        });
    };
  }

  angular.module('app')
    .controller('RegisterCtrl', RegisterCtrl)
})();
