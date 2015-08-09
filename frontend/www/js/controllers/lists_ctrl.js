(function() {
    var ListsCtrl = function($scope, $state, $ionicModal, $ionicLoading, RestaurantDetails, RestaurantPreference, ListDetails, Lists, ALL_CUISINE_TYPES) {
        loadListData();

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

        $scope.editList = function(listData) {
            $scope.newList = {
                objectId: $scope.listData.id,
                category: $scope.listData.attributes.category,
                description: $scope.listData.attributes.description,
                name: $scope.listData.attributes.name
            };
            console.log($scope.newList);
            $scope.openModal();
        };

        $scope.saveList = function() {
            console.log($scope.newList);
            showLoading();
            Lists.editList($scope.newList)
            .then(function(success) {
                console.log(success);
                hideLoading();
                $scope.closeModal();
            }, function(error) {
                console.log(error);
            });
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

        $scope.removeRestaurant = function(index, restaurant) {
            if ($scope.listData.name == 'Save for Later') {
                $scope.favouritesList.splice(index, 1);
                var preference = new RestaurantPreference(Parse.User.current(), restaurant.foursquareId);
                preference.set(false)
                    .then(function() {
                        console.log('Removed');
                    });
            } else {
                $scope.restaurantList.splice(index, 1);
                Lists.removeRestaurantListRelation($scope.listData, restaurant.foursquareId)
                    .then(function() {
                        console.log('Removed');
                    })
            }     
        };

        $scope.goToDetails = function(restaurant) {
            RestaurantDetails.setVenueId(restaurant.foursquareId);
            $state.go('tab.details');
        };

        function loadListData() {
            $scope.listData = ListDetails.getListDetails();
            
            if ($scope.listData.name == 'Save for Later') {
                var savedRestaurants = Parse.User.current().relation('savedRestaurants');
                return savedRestaurants.query().collection().fetch()
                    .then(function(restaurants) {
                        $scope.favouritesList = restaurants.toJSON();
                        $scope.$digest();
                    });
            } else {
                var restaurants = $scope.listData.relation('restaurants');
                return restaurants.query().collection().fetch()
                    .then(function(restaurants) {
                        $scope.restaurantList = restaurants.toJSON();
                        $scope.$digest();
                    });
            }
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
        .controller('ListsCtrl', ListsCtrl)
})();
