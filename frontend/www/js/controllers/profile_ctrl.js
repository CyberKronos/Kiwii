(function() {
    var ProfileCtrl = function($scope, $state, $cordovaStatusbar, $ionicModal, $ionicLoading, RestaurantDetails, RestaurantPreference, PhotoDetails, Lists, ListDetails, FacebookApi, Following, ALL_CUISINE_TYPES) {

        getUserPhotos();
        getUserLists();
        getFollowingCount();
        getFollowerCount();

        var saveForLaterList = {
            name: 'Save for Later',
            description: 'Save the restaurants you want to check out later.',
            category: 'All restaurants'
        };

        $scope.doRefresh = function() {
            getUserPhotos();
            getUserLists();
            getFollowingCount();
            getFollowerCount();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        };

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
            $scope.newList = {};
            $scope.newList['type'] = 'create';
            console.log($scope.newList);
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

        $scope.callbackValueModel = "";        

        $scope.getCuisineItems = function (query) {
            var searchItems = ALL_CUISINE_TYPES.CUISINE_TYPES;
            var returnValue = { items: [] };
            searchItems.forEach(function(item){
                if (item.name.toLowerCase().indexOf(query) > -1 ){
                    returnValue.items.push(item);
                }
                else if (item.id.toLowerCase().indexOf(query) > -1 ){
                returnValue.items.push(item);
                }
            });
            return returnValue;
        };

        $scope.itemsClicked = function (callback) {
            $scope.callbackValueModel = callback;
            $scope.newList['categoryId'] = callback.item.id;
        };

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

        function getUserPhotos() {
            var uploadedPhotos = Parse.User.current().relation('uploadedPhotos');
            uploadedPhotos.query().find()
                .then(function(photos) {
                    $scope.photos = photos;
                    console.log($scope.photos);
                });
        }

        function getUserLists() {
            var userLists = Parse.User.current().relation('lists');
            userLists.query().find()
                .then(function(lists) {
                    $scope.userLists = lists;
                    console.log($scope.userLists);
                });
        }

        function getFollowingCount() {
            Following.followingList()
                .then(function(result) {
                    $scope.followingCount = result.length;
                });  
        }

        function getFollowerCount() {
            Following.followerList()
                .then(function(result) {
                    $scope.followerCount = result.length;
                });  
        }
    };

    angular.module('kiwii')
        .controller('ProfileCtrl', ProfileCtrl)
})();
