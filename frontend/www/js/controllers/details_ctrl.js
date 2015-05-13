(function() {
  var DetailsCtrl = function($scope, $ionicSlideBoxDelegate) {
    
    $scope.navSlide = function(index) {
      	$ionicSlideBoxDelegate.slide(index, 500);
    }

    $scope.openWebsite = function(link) {
    	window.open(link, '_blank', 'location=yes');
    }
  
  };

  angular.module('app').
    controller('DetailsCtrl', DetailsCtrl);
})();
