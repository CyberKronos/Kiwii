(function() {
  var DetailsCtrl = function($scope, $ionicSlideBoxDelegate) {
    
    $scope.navSlide = function(index) {
      $ionicSlideBoxDelegate.slide(index, 500);
    }
  
  };

  angular.module('app').
    controller('DetailsCtrl', DetailsCtrl);
})();
