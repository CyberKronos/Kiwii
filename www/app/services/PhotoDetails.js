(function () {
    var PhotoDetails = function () {
        var selectedPhoto;

        return {
            getPhotoDetails: getPhotoDetails,
            setPhotoDetails: setPhotoDetails
        };

        function setPhotoDetails(photoData) {
            selectedPhoto = photoData;
        }

        function getPhotoDetails() {
            return selectedPhoto;
        }
    };

    angular.module('kiwii')
        .factory('PhotoDetails', PhotoDetails);
})();