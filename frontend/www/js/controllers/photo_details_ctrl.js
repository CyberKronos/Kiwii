(function () {
  var PhotoDetailsCtrl = function ($scope, $state, $stateParams, $ionicActionSheet, $cordovaInAppBrowser, FoursquareApi, Cards) {

    loadPhotoData();

    var card = $stateParams.card;

    $scope.user = Parse.User.current();

    $scope.restaurantDetails = function (foursquareId) {
      console.log(card);
      $state.go('tab.details', {
        venueId: foursquareId,
        card: card,
        restaurant: card.taggedRestaurant
      });
    };

    $scope.openWebsite = function (link) {
      console.log(link);
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };
      $cordovaInAppBrowser.open(link, '_blank', options);
    };

    $scope.cardSettings = function () {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'Edit'}
        ],
        destructiveText: 'Delete',
        titleText: 'Card Settings',
        cancelText: 'Cancel',
        cancel: function () {
          return true;
        },
        buttonClicked: function (index) {
          return true;
        },
        destructiveButtonClicked: function () {
          Cards.deleteUserCard(card)
            .then(function () {
              console.log('Card deleted');
              hideSheet();
              $state.go('tab.profile');
            });
        }
      });
    };

    function loadPhotoData() {
      $scope.photoData = $stateParams.card.attributes.photos[0].attributes;
      $scope.author = $stateParams.card.attributes.author;
      $scope.restaurantData = $stateParams.card.attributes.taggedRestaurant.attributes;
    }
  };

  angular.module('kiwii')
    .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)
})();