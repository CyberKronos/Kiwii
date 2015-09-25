(function () {
  angular.module('kiwii').
    directive('scrollList', function ($q) {

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
    });
})();
