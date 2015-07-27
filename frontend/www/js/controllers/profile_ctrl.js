(function() {
    var ProfileCtrl = function($scope, $state, $cordovaStatusbar, $ionicModal, RestaurantDetails, RestaurantPreference, PhotoDetails) {
        if (window.cordova) { 
          $cordovaStatusbar.style(1);
        }

        var uploadedPhotos = Parse.User.current().relation('uploadedPhotos');
        uploadedPhotos.query().collection().fetch()
            .then(function(photos) {
                $scope.photos = photos.toJSON();
                console.log($scope.photos);
                $scope.$digest();
            });

        $scope.newList = {};

        $ionicModal.fromTemplateUrl('templates/create_list_popup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });  

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.photoDetails = function(photo) {
            PhotoDetails.setPhotoDetails(photo);
            $state.go('tab.photoDetails');
        };

        $scope.createList = function(){ 
            $scope.openModal();
        };

        $scope.saveList = function() {

        };

        $scope.goToList = function() {
            $state.go('tab.lists');
        };
    };

    angular.module('kiwii')
        .controller('ProfileCtrl', ProfileCtrl)
})();
