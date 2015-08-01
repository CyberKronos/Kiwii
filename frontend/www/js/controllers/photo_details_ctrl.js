(function() {
    var PhotoDetailsCtrl = function($scope, PhotoDetails) {
        
        $scope.photoData = PhotoDetails.getPhotoDetails();

    };

    angular.module('kiwii')
        .controller('PhotoDetailsCtrl', PhotoDetailsCtrl)
})();
