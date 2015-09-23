(function() {
  var HandleCtrl = function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, Actions) {

    $scope.socialHandle = {};

    var currentUser = Parse.User.current();

    $scope.createHandle = function() {
      console.log($scope.socialHandle);
      showLoading('Creating accounting');
      if ($scope.socialHandle.handle) {
      	Actions.createHandle($scope.socialHandle, currentUser)
	      	.then(function(result) {
	      		hideLoading();
	      		if (result == 'Handle is taken') {
	      			var confirmPopup = $ionicPopup.confirm({
			            title: 'Handle taken',
			            template: "This handle has been taken. Please try another one.",
			            buttons: [
			              {
			                text: 'Close'
			              }
			            ]
			        });
	      		} else {
	      			console.log(result);
	      			$rootScope.currentUser = Parse.User.current().attributes;
	      			$state.go('tab.dash');
	      		}
	      	});
      } else {
   		hideLoading();
      	var confirmPopup = $ionicPopup.confirm({
            title: 'Enter a handle',
            template: "Please enter a handle.",
            buttons: [
              {
                text: 'Close'
              }
            ]
        });
      }
    };

    function showLoading(msg) {
        $scope.isLoading = true;
        $ionicLoading.show({
            template: msg
        });
    }

    function hideLoading() {
        $scope.isLoading = false;
        $ionicLoading.hide();
    }   
  };

  angular.module('kiwii').
    controller('HandleCtrl', HandleCtrl);
})();
