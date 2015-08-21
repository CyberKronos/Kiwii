(function() {
    var ExploreListsCtrl = function($scope, $state, $timeout, $ionicScrollDelegate, FacebookApi) {

        applyHorizontalScrollFix('people-suggestions-scroll');
        getNewsFeed();

        FacebookApi.getFriendsInApp()
          .then(function(response) {
            $scope.suggestedPeople = response.data;
            console.log($scope.suggestedPeople);
          });

        $scope.doRefresh = function() {
          getNewsFeed();
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        };

        // Maybe should move to a service
        function getNewsFeed() {
          var currentUser = Parse.User.current();
          Parse.Cloud.run('feed', {
            feed : 'flat:' + currentUser.id
          }).then(function (response) {
            console.log(response.activities);
            $scope.newsFeed = response.activities;
          });
        }

        /**
         * Allows Horizontal Scroll Content area to be used to vertically scroll its parent's container.
         * Needs to be used with horizontalScrollFix directive.
         * Adapted from http://codepen.io/rajeshwarpatlolla/pen/xGWBja?editors=101
         * Waiting for official fix in Ionic 1.1
         * @param ionScrollHandle delegate handle of the ion-scroll content
         */
        function applyHorizontalScrollFix(ionScrollHandle) {
          $timeout(function(){
            //return false; // <--- comment this to "fix" the problem
            var sv = $ionicScrollDelegate.$getByHandle(ionScrollHandle).getScrollView();

            var container = sv.__container;

            var originaltouchStart = sv.touchStart;
            var originalmouseDown = sv.mouseDown;
            var originaltouchMove = sv.touchMove;
            var originalmouseMove = sv.mouseMove;

            container.removeEventListener('touchstart', sv.touchStart);
            container.removeEventListener('mousedown', sv.mouseDown);
            document.removeEventListener('touchmove', sv.touchMove);
            document.removeEventListener('mousemove', sv.mousemove);


            sv.touchStart = function(e) {
              e.preventDefault = function(){};
              originaltouchStart.apply(sv, [e]);
            };

            sv.touchMove = function(e) {
              e.preventDefault = function(){};
              originaltouchMove.apply(sv, [e]);
            };

            sv.mouseDown = function(e) {
              e.preventDefault = function(){};
              originalmouseDown.apply(sv, [e]);
            };

            sv.mouseMove = function(e) {
              e.preventDefault = function(){};
              originalmouseMove.apply(sv, [e]);
            };

            container.addEventListener("touchstart", sv.touchStart, false);
            container.addEventListener("mousedown", sv.mouseDown, false);
            document.addEventListener("touchmove", sv.touchMove, false);
            document.addEventListener("mousemove", sv.mouseMove, false);
          });
        }
    
    };

    angular.module('kiwii')
        .controller('ExploreListsCtrl', ExploreListsCtrl)
})();
