(function() {
    var FollowCtrl = function($scope, $state, $stateParams, Following) {
        
        var userData = $stateParams.user;
        getFollowingData();
        getFollowerData();

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

        function getFollowingData() {
          Following.followingList(userData)
            .then(function (result) {
              $scope.following = result;
            });
        }

        function getFollowerData() {
          Following.followerList(userData)
            .then(function (result) {
              $scope.followers = result;
            });
        }
    };

    angular.module('kiwii')
        .controller('FollowCtrl', FollowCtrl)
})();
