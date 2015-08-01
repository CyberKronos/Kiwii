(function () {
    var ListDetails = function () {
        var selectedList;

        return {
            getListDetails: getListDetails,
            setListDetails: setListDetails
        };

        function setListDetails(listData) {
            selectedList = listData;
        }

        function getListDetails() {
            return selectedList;
        }
    };

    angular.module('kiwii')
        .factory('ListDetails', ListDetails);
})();