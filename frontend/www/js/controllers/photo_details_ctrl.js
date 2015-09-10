(function () {
  var PhotoDetailsCtrl = function ($scope, $state, $stateParams, $ionicActionSheet, FoursquareApi, Cards) {

    loadPhotoData();

    var card = $stateParams.card

    $scope.restaurantDetails = function (foursquareId) {
        $state.go('tab.details', {
            venueId: foursquareId,
            card: card
        });
    };

    $scope.cardSettings = function() {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Edit' }
            ],
            destructiveText: 'Delete',
            titleText: 'Card Settings',
            cancelText: 'Cancel',
            cancel: function() {
                return true;
            },
            buttonClicked: function(index) {
                return true;
            },
            destructiveButtonClicked: function() {
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
      $scope.restaurantData = $stateParams.card.attributes.taggedRestaurant.attributes;
      console.log($scope.restaurantData);
    }
  };

  angular.module('kiwii')
    .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)
})();