(function() {
    var IntroCtrl = function($scope, $state, $cordovaStatusbar) {

        // Called to navigate to the main app
        $scope.goToDashView = function() {
            $state.go('tab.dash');
        };
        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
    };

    angular.module('kiwii')
        .controller('IntroCtrl', IntroCtrl)
})();
