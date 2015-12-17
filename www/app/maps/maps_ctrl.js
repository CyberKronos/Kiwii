(function () {
  angular.module('kiwii').
    controller('MapsCtrl', ['$scope', '$compile', '$stateParams', 'RestaurantDetails',
      function ($scope, $compile, $stateParams, RestaurantDetails) {

        $scope.init = function () {
          RestaurantDetails.fetchVenue($stateParams.venueId)
            .then(function (restaurant) {
              showOnMap(restaurant.details);
              $scope.latlong = restaurant.details.location;
            });

          function showOnMap(restaurantDetails) {
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

        $scope.openMapsApp = function() {
          var isIOS = ionic.Platform.isIOS();
          var isAndroid = ionic.Platform.isAndroid();
          if (isIOS) {
            console.log('this is iOS');
            window.location.href = "maps://maps.apple.com/?q=" + $scope.latlong.lat + "," + $scope.latlong.lng;
          } 
          if (isAndroid) {
            console.log('this is android');
            window.open('geo:' + $scope.latlong.lat + ',' + $scope.latlong.lng + '?q=' + $scope.latlong.address, '_system');
          }
        };

      }]);
})();
