(function() {
  var MapsCtrl = function($scope, $rootScope, $compile) {
    $scope.init = function() {
      // TODO: retrive lat/long from service instead of rootScope
      var myLatlng = new google.maps.LatLng($rootScope.restaurantDetails.location.lat, $rootScope.restaurantDetails.location.lng);

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

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });

      $scope.map = map;
    };
  }

  angular.module('kiwii').
    controller('MapsCtrl', MapsCtrl);
})();
