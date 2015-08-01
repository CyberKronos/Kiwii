(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', function($scope) {
      $scope.myList = [
        {
          image: 'http://placehold.it/100x100?text=Kiwii',
          name: 'A Place',
          type: 'Italian'
        },
        {
          image: 'http://placehold.it/100x100?text=Kiwii',
          name: 'Bistro',
          type: 'French'
        },
        {
          image: 'http://placehold.it/100x100?text=Kiwii',
          name: 'The Dragon',
          type: 'Chinese'
        },
        {
          image: 'http://placehold.it/100x100?text=Kiwii',
          name: 'Crawford',
          type: 'British'
        },
        {
          image: 'http://placehold.it/100x100?text=Kiwii',
          name: 'Sofkra',
          type: 'Indian'
        },
        {
          image: 'http://placehold.it/100x100?text=Kiwii',
          name: 'Hajime',
          type: 'Japanese'
        },
        {
          image: 'http://placehold.it/100x100?text=Kiwii',
          name: 'Sodium Laureth Sulfate',
          type: 'Modern'
        }
      ]
    }]);
})();