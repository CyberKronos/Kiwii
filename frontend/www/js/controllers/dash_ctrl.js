(function() {
  var DashCtrl = function($scope, $rootScope, $ionicSideMenuDelegate, $state, $ionicHistory) {
    
    console.log($ionicHistory.currentView());

    $scope.distanceList = {
      min:'0',
      max:'15',
      value:'0.5'
    }

    $scope.priceList = [
      { text: "$", value: "1" },
      { text: "$$", value: "2" },
      { text: "$$$", value: "3" },
      { text: "$$$$", value: "4" }
    ];

    // Default values
    $scope.data = {};
    $scope.data.distance = '500';

    $scope.updateDistance = function(item) {
      // $window.localStorage.setItem( 'distance', item.value );
      console.log(item);
      $rootScope.searchCriteria['distance'] = item * 1000;
      console.log( 'Distance: ' + $rootScope.searchCriteria['distance'] );
    };

    $scope.updatePrice = function(item) {
      // $window.localStorage.setItem( 'price', item.value );
      console.log(item.value);
      $rootScope.searchCriteria['price'] = item.value;
      console.log( 'Price: ' + $rootScope.searchCriteria['price'] );
    };

    $scope.searchRestaurants = function() {
      $state.go('cards', {});
    };

    $scope.selectCuisinesPopup = function() {
      // $ionicHistory.currentTitle('Main');
      console.log($ionicHistory.viewHistory());
    };
  }

  angular.module('app').
    controller('DashCtrl', DashCtrl);
})();
