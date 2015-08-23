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
    };

    angular.module('kiwii')
        .controller('FollowCtrl', FollowCtrl)
})();
