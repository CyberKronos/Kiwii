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
          attachRefreshEventListener();

          function callItemsMethod() {
            if (!angular.isFunction(scope.itemsMethod)) return;

            showLoadingIcon();
            return $q.when(scope.itemsMethod())
              .then(showContent)
              .catch(showErrorMessage)
              .finally(loadingIcon.hide);
          }

          function showContent(data) {
            if (!data || data.length <= 0) {
              showErrorMessage('No Results');
            } else {
              ngModel.$setViewValue(data);
              content.css('display', 'inherit');
              loadingIcon.css('display', 'none');
            }
            return data;
          }

          function showLoadingIcon() {
            loadingIcon.css('display', 'inherit');
            errorMessage.css('display', 'none');
            content.css('display', 'none');
          }

          function showErrorMessage(error) {
            errorMessage.text(error.message || 'An Error Occurred');
            loadingIcon.css('display', 'none');
            errorMessage.css('display', 'inherit');
            return $q.reject(error);
          }

          function attachRefreshEventListener() {
            scope.$on('scrollList.refresh', function () {
              showLoadingIcon();
              return callItemsMethod();
            });
          }
        }
      };
    });
})();
