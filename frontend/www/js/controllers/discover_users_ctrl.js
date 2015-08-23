(function() {
    var DiscoverUsersCtrl = function($scope, $state, $timeout, $ionicScrollDelegate, FacebookApi, Following) {

    	getNewUsers();

        $scope.followUser = function(userObject) {
          	Following.followUser(userObject)
          		.then(function(result) {
      				console.log(result);
          		});
        };

        $scope.unfollowUser = function(userObject) {
          	Following.unfollowUser(userObject)
          		.then(function(result) {
          			console.log(result);
          		});
        };

        function getNewUsers() {
          FacebookApi.getFriendsInApp()
	        .then(function(response) {
	        	angular.forEach(response.data, function(value, key) {
	              	var fbId = value.id;
	              	getParseUserInfo(fbId)
                  		.then(function (result) {
                  			if (result != 'no results') {
                  				value['userObject'] = result;
                  				console.log(value);
                  			}
                  		});
	            });
	            $scope.suggestedUsers = response.data;
	        });
        }

        function getParseUserInfo(fbId) {
          var query = new Parse.Query(Parse.User);
          query.equalTo("fbId", fbId);
          return query.find()
            .then(function (result) {
            	if (result[0]) {
            		console.log(result[0]);
            		return result[0];
            	} else {
            		return 'no results';
            	}
            }, function (error) {
                console.log(error);
                return 'no results';
            });
        }
    };

    angular.module('kiwii')
        .controller('DiscoverUsersCtrl', DiscoverUsersCtrl)
})();
