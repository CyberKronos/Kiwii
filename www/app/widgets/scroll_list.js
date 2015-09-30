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

          var loadingIcon = element.find('ion-spinner');
          var errorMessage = element.find('p');
          var content = element.find('ion-scroll');

          callItemsMethod();

          scope.$on('scrollList.refresh', function () {
            showLoadingIcon();
            return callItemsMethod();
          });

          function callItemsMethod() {
            if (angular.isFunction(scope.itemsMethod)) {
              showLoadingIcon();
              var promise = $q.when(scope.itemsMethod());

              promise.then(function (data) {
                if (!data || data.length <= 0) {
                  showErrorMessage('No Results');
                } else {
                  showContent(data);
                }
                return data;

              }).catch(function (error) {
                showErrorMessage(error.message || 'An Error Occurred');
                return $q.reject(error);
              })
                .finally(loadingIcon.hide);
            }
          }

          function showContent(data) {
            //scope.items = data;
            ngModel.$setViewValue(data);
            content.css('display', 'inherit');
            loadingIcon.css('display', 'none');
          }

          function showLoadingIcon() {
            loadingIcon.css('display', 'inherit');
            errorMessage.css('display', 'none');
            content.css('display', 'none');
          }

          function showErrorMessage(message) {
            errorMessage.text(message);
            loadingIcon.css('display', 'none');
            errorMessage.css('display', 'inherit');
          }
        }
      };
    });
})();
