(function () {
    var RestaurantDetails = function ($q, FoursquareApi, InstagramApi) {

        return {
            fetchVenue: fetchVenue
        };

        function fetchVenue(venueId) {
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