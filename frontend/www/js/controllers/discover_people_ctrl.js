(function() {
    var DiscoverPeopleCtrl = function($scope, $state, $timeout, $ionicScrollDelegate, FacebookApi) {

        FacebookApi.getFriendsInApp()
          .then(function(response) {
            $scope.suggestedPeople = response.data;
            console.log($scope.suggestedPeople);
          });
    };

    angular.module('kiwii')
        .controller('DiscoverPeopleCtrl', DiscoverPeopleCtrl)
})();
