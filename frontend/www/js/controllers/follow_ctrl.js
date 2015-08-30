(function() {
    var FollowCtrl = function($scope, $state, Following) {
        
        Following.followingList()
        	.then(function(result) {
        		$scope.following = result;
        	}); 

       	Following.followerList()
        	.then(function(result) {
        		$scope.followers = result;
        	});    

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
