(function () {
    var RestaurantDetails = function ($q, FoursquareApi, InstagramApi) {
        var selectedId = 0;

        return {
            getVenueId: getVenueId,
            setVenueId: setVenueId,
            fetchVenue: fetch
        };

        function setVenueId(venueId) {
            selectedId = venueId;
        }

        function getVenueId() {
            return selectedId;
        }

        function fetch(venueId) {
            if (!venueId) {
                venueId = selectedId;
            }
            var detailsQ = FoursquareApi.getRestaurantDetails(venueId);
            var imagesQ = InstagramApi.getLocationImages(venueId);
            var reviewsQ = FoursquareApi.getRestaurantReviews(venueId);

            return $q.all({
                details: detailsQ,
                images: imagesQ,
                reviews: reviewsQ
            });
        }
    };

    angular.module('kiwii')
        .factory('RestaurantDetails', ['$q', 'FoursquareApi', 'InstagramApi', RestaurantDetails]);
})();