(function() {
    var ProfileCtrl = function($scope, $state, $cordovaStatusbar, $ionicModal, $ionicLoading, RestaurantDetails, RestaurantPreference, PhotoDetails, Lists, ListDetails) {
        if (window.cordova) { 
          $cordovaStatusbar.style(1);
        }

        var saveForLaterList = {
            name: 'Save for Later',
            description: 'Save the restaurants you want to check out later.',
            category: 'All restaurants'
        };

        var uploadedPhotos = Parse.User.current().relation('uploadedPhotos');
        uploadedPhotos.query().collection().fetch()
            .then(function(photos) {
                $scope.photos = photos.toJSON();
                console.log($scope.photos);
                $scope.$digest();
            });

        var userLists = Parse.User.current().relation('lists');
        userLists.query().collection().fetch()
            .then(function(lists) {
                $scope.userLists = lists.toJSON();
                console.log($scope.userLists);
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
            showLoading();
            Lists.saveList($scope.newList)
            .then(function(success) {
                console.log(success);
                hideLoading();
                $scope.closeModal();
            }, function(error) {
                console.log(error);
            });
        };

        $scope.listDetails = function(list) {
            if (list == 'saveForLater') {
                ListDetails.setListDetails(saveForLaterList);
            } else {
                ListDetails.setListDetails(list);
            }
            $state.go('tab.lists');
        };

        // test
        $scope.model = "";
        $scope.callbackValueModel = "";
        $scope.getTestItems = function (query) {
            return {
                items: [
                    {id: "1", name: "test" },
                    {id: "2", name: "haha" },
                    {id: "3", name: "asdfasdfasd" }
                ]
            };
        };
        $scope.itemsClicked = function (callback) {
            $scope.callbackValueModel = callback;
        }

        function showLoading() {
            $scope.isLoading = true;
            $ionicLoading.show({
                template: 'Creating list...'
            });
        }

        function hideLoading() {
            $scope.isLoading = false;
            $ionicLoading.hide();
        }   
    };

    angular.module('kiwii')
        .controller('ProfileCtrl', ProfileCtrl)
})();
