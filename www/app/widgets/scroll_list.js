(function () {
  angular.module('kiwii').
    directive('scrollList', function ($q, $timeout, $ionicScrollDelegate) {

      return {
        restrict: 'E',
        require: '?ngModel',
        templateUrl: 'app/widgets/scroll_list.html',
        transclude: true,
        scope: {
          scrollDelegate: '@',
          parentScrollDelegate: '@',
          itemsMethod: '='
        },
        link: function (scope, element, attrs, ngModel) {

          if (!ngModel) return; // do nothing if ngModel is missing

          if (scope.parentScrollDelegate) {
            applyHorizontalScrollFix(scope.scrollDelegate || 'scroll-list');
          }
          callItemsMethod();

          scope.$on('scrollList.refresh', function () {
            scope.errorMessage = '';
            return callItemsMethod();
          });

          function callItemsMethod() {
            if (angular.isFunction(scope.itemsMethod)) {
              // show loading icon
              scope.showLoading = true;

              var promise = $q.when(scope.itemsMethod());

              promise.then(function (data) {
                // hide loading icon
                scope.showLoading = false;
                scope.items = data;
                ngModel.$setViewValue(data);

                if (!data || data.length <= 0) {
                  scope.errorMessage = 'No Results';
                }
                return data;

              }).catch(function (error) {
                scope.showLoading = false;
                scope.errorMessage = 'An Error Occurred';
                // show error
                return $q.reject(error);
              })
            }
          }
        }
      };

      /**
       * Allows Horizontal Scroll Content area to be used to vertically scroll its parent's container.
       * Needs to be used with horizontalScrollFix directive.
       * Adapted from http://codepen.io/rajeshwarpatlolla/pen/xGWBja?editors=101
       * Waiting for official fix in Ionic 1.1
       * @param ionScrollHandle delegate handle of the ion-scroll content
       */
      function applyHorizontalScrollFix(ionScrollHandle) {
        $timeout(function () {
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


          sv.touchStart = function (e) {
            e.preventDefault = function () {
            };
            originaltouchStart.apply(sv, [e]);
          };

          sv.touchMove = function (e) {
            e.preventDefault = function () {
            };
            originaltouchMove.apply(sv, [e]);
          };

          // sv.mouseDown = function (e) {
          //   e.preventDefault = function () {
          //   };
          //   originalmouseDown.apply(sv, [e]);
          // };

          // sv.mouseMove = function (e) {
          //   e.preventDefault = function () {
          //   };
          //   originalmouseMove.apply(sv, [e]);
          // };

          container.addEventListener("touchstart", sv.touchStart, false);
          container.addEventListener("mousedown", sv.mouseDown, false);
          document.addEventListener("touchmove", sv.touchMove, false);
          document.addEventListener("mousemove", sv.mouseMove, false);
        })
      }
    });
})();
