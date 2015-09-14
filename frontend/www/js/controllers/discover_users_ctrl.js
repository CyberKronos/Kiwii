(function() {
    var DiscoverUsersCtrl = function($scope, $state, $timeout, $ionicScrollDelegate, FacebookApi, Following, USER_SUGGESTIONS) {

      getKiwiiEndorsedUsers();
    	// getFacebookUsers();

      $scope.followUser = function(userObject, index) {
        $scope.kiwiiEndorsedUsers.splice(index, 1);
      	Following.followUser(userObject)
      		.then(function(result) {
  				  console.log(result);
      		});
      };

      $scope.viewProfile = function (userObject) {
        $state.go('tab.publicProfile', {
            userId: userObject.id,
            user: userObject
        });
    };

      function getKiwiiEndorsedUsers() {
        var kiwiiUsers = USER_SUGGESTIONS.KIWII_ENDORSED;
        angular.forEach(kiwiiUsers, function(value, key) {
          var fbId = value.fbId;
          getParseUserInfo(fbId)
            .then(function (result) {
              if (result != 'no results') {
                var currentUserFbId = Parse.User.current().attributes.fbId;
                Following.followRelationship(result)
                  .then(function (data){
                    if (!(data || currentUserFbId == fbId)) {
                      value['userObject'] = result;
                    }
                  });
              }
            });
        });
        $scope.kiwiiEndorsedUsers = kiwiiUsers;
        console.log($scope.kiwiiEndorsedUsers);
      }

      // function getFacebookUsers() {
      //   FacebookApi.getFriendsInApp()
      //   .then(function(response) {
      //   	angular.forEach(response.data, function(value, key) {
      //       	var fbId = value.id;
      //       	getParseUserInfo(fbId)
      //         		.then(function (result) {
      //         			if (result != 'no results') {
      //         				value['userObject'] = result;
      //         				console.log(value);
      //         			}
      //         		});
      //     });
      //     $scope.suggestedFbFriends = response.data;
      //   });
      // }

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
