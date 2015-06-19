(function () {
  angular.module('kiwii').
    controller('MapsCtrl', ['$scope', '$compile', 'RestaurantDetails',
      function ($scope, $compile, RestaurantDetails) {
        $scope.init = function () {

          RestaurantDetails.fetchVenue()
            .then(function (restaurant) {
              showOnMap(restaurant.details)
            });

          function showOnMap(restaurantDetails) {
            // TODO: retrive lat/long from service instead of rootScope
            var myLatlng = new google.maps.LatLng(restaurantDetails.location.lat,
              restaurantDetails.location.lng);

            var mapOptions = {
              center: myLatlng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Location</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
              content: compiled[0]
            });

            var marker = new google.maps.Marker({
              position: myLatlng,
              map: map
            });

            google.maps.event.addListener(marker, 'click', function () {
              infowindow.open(map, marker);
            });

            $scope.map = map;
          }
        };
      }]);
})();
