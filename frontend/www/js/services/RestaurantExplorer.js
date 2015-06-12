(function () {
  var RestaurantExplorer = function ($rootScope, FoursquareApi) {
    var prevRestaurants = [];

    var service = {
      fetch : fetch,
      results : [],
      nextRestaurant : nextRestaurant,
      prevRestaurant : prevRestaurant
    };

    return service;

    function fetch() {
      clearOldSearchResults();
      return FoursquareApi.exploreRestaurants($rootScope.searchCriteria)
        .then(function(result) {
          service.results = result;
          console.log(service.results);
          return service.results;
        });
    }

    function nextRestaurant() {
      var lastRestaurant = service.results.shift();
      prevRestaurants.push(lastRestaurant);
      return service.results[0];
    }

    function prevRestaurant() {
      var lastRestaurant = prevRestaurants.pop();
      service.results.splice(0, 0, lastRestaurant);
      return service.results[0];
    }

    function clearOldSearchResults() {
      prevRestaurants = [];
      service.results = [];
    }
  };

  angular.module('kiwii')
    .factory('RestaurantExplorer', ['$rootScope', 'FoursquareApi', RestaurantExplorer]);
})();