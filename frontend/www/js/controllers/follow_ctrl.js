(function() {
    var FollowCtrl = function($scope, $state, $stateParams, Following) {
        
        var userData = $stateParams.user;

        console.log(userData);

        Following.followingList(userData)
        	.then(function(result) {
        		$scope.following = result;
                console.log(result);
        	}); 

       	Following.followerList(userData)
        	.then(function(result) {
        		$scope.followers = result;
                console.log(result);
        	});  

        $scope.viewProfileFollowing = function(user) {
            console.log(user);
            $state.go('tab.publicProfile', {
                user: user.attributes.object
            });
        };

        $scope.viewProfileFollowers = function(user) {
            console.log(user);
            $state.go('tab.publicProfile', {
                user: user.attributes.actor
            });
        };

        $scope.unfollowUser = function(userData, index) {
            $scope.following.splice(index, 1);
            Following.unfollowUser(userData)
                .then(function(result) {
                    console.log(result);
                }, function(error) {
                    console.log(error);
                });
        };
    };

    angular.module('kiwii')
        .controller('FollowCtrl', FollowCtrl)
})();
