(function () {
  angular.module('kiwii').
    controller('DashCtrl', ['$scope', '$state', '$timeout', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$q', '$templateCache',
      'Cards', 'User', 'Lists', 'LocationService', 'RestaurantExplorer', 'ViewedHistory', 'CRITERIA_OPTIONS',
      function ($scope, $state, $timeout, $ionicScrollDelegate, $ionicSlideBoxDelegate, $q, $templateCache,
                Cards, User, Lists, LocationService, RestaurantExplorer, ViewedHistory, CRITERIA_OPTIONS) {

        $scope.$on('$ionicView.beforeEnter', function() {
          loadContent();
          
          setTimeout( function() { 
            $ionicSlideBoxDelegate.update();
          }, 1500);
        });

        $scope.listDetails = function (list) {
          $state.go('tab.lists', {list: list});
        };

        $scope.restaurantDetails = function (card) {
          console.log(card);
          $state.go('tab.details', {
            venueId: card.taggedRestaurant.foursquareId,
            card: card,
            restaurant: card.taggedRestaurant
          });
        };

        function loadContent() {
          $scope.findRestaurantsNearby = findRestaurantsNearby;
          $scope.getRecentlyViewedRestaurants = getRecentlyViewedRestaurants;
          $scope.getUserCards = getUserCards;
          getKiwiiFeatured();
        }

        function getKiwiiFeatured() {
          User.getUserById('M00urkEBxN')
          .then(function (result) {
            var userObject = result[0];
            var userLists = userObject.relation('lists');

            userLists.query()
            .include('actor')
            .descending("updatedAt")
            .limit(1)
            .find()
            .then(function (list) {
              $scope.kiwiiFeaturedList = list[0];
              console.log($scope.kiwiiFeaturedList);

              $scope.kiwiiFeaturedList.fetchCards()
              .then(function (cards) {                
                // TODO: Make Restaurant a ParseObject
                $scope.kiwiiFeaturedCards = _.map(cards, function (card) {
                  card.taggedRestaurant = card.taggedRestaurant.toJSON();
                  return card;
                });

                console.log($scope.kiwiiFeaturedCards);
              });
            });
          });
        }

        function getUserCards() {
          return Cards.getUserCards(Parse.User.current().id);
        }

        function findRestaurantsNearby() {
          return LocationService.fetchCurrentLocation()
            .then(function (latLng) {
              var nearbyCriteria = {
                ll: latLng.lat + ',' + latLng.lng,
                radius: 2000,
                query: CRITERIA_OPTIONS.CUISINE_TYPES[0]['name'],
                limit: 10
              };
              return RestaurantExplorer.findWithKiwii(nearbyCriteria);
            })
            .catch(LocationService.showLocationError);
        }

        function getRecentlyViewedRestaurants() {
          return ViewedHistory.retrieveRecentRestaurants(Parse.User.current().id);
        }

        $scope.doRefresh = function () {
          $scope.$broadcast('scrollList.refresh');
          loadContent();
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        };
      }]);
})();
