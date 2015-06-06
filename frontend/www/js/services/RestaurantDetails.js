(function () {
        var RestaurantDetails = function ($q, FoursquareApi, InstagramApi) {
            var selectedId = 0;

            return {
                venueId: selectedId,
                setVenueId: setVenueId,
                fetchFor: fetchFor
            };

            function setVenueId(venueId) {
                selectedId = venueId;
            }

            function fetchFor(venueId) {
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