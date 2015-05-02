(function() {
  var RegisterCtrl = function($scope, $state, $localStorage) {
    $scope.registerObj = {};
    $scope.emailRegister = function() {
        var user = new Parse.User();
        user.set("username", $scope.registerObj.username);
        user.set("firstname", $scope.registerObj.firstname);
        user.set("lastname", $scope.registerObj.lastname);
        user.set("email", $scope.registerObj.email); 
        user.set("password", $scope.registerObj.password);
        user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                console.log(user);
                $state.go('dash');
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                console.log("Error: " + error.code + " " + error.message);
                // var message = "Error: " + error.code + " " + error.message;
                // Alerts.error(message);
            }
        });
    };
  }

  angular.module('app')
    .controller('RegisterCtrl', RegisterCtrl)
})();
