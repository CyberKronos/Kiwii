(function() {
  var TopTenCtrl = function($scope, $rootScope, $state) {
    $rootScope.cardTitle = "Top 10"; 
    $scope.topTenList = [
      { type: "American" },
      { type: "Asian" },
      { type: "Bakery" },
      { type: "Bistro" },
      { type: "Breakfast Spots" },
      { type: "Burger Joint" },
      { type: "Cafe" },
      { type: "Chinese" },
      { type: "French" },
      { type: "Greek" },
      { type: "Indian" },
      { type: "Italian" },
      { type: "Japanese" },
      { type: "Korean" },
      { type: "Malaysian" },
      { type: "Mexican" },
      { type: "Middle Eastern" },
      { type: "Southern / Soul" },
      { type: "Spanish" },
      { type: "Turkish" },
      { type: "Vegetarian / Vegan" },
      { type: "Vietnamese" }
    ];

    $scope.topTenCards = function(cuisine) {
      $rootScope.cuisineType = cuisine;
      $state.go('cards');
    };
  };

  angular.module('kiwii').
    controller('TopTenCtrl', TopTenCtrl);
})();
