(function() {
    var FollowCtrl = function($scope, $state, $stateParams, Following) {
        
        var userData = $stateParams.user;
        $scope.following = $stateParams.following;
        $scope.followers = $stateParams.followers;

        console.log(userData); 

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
