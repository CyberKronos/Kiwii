(function () {
    var Favourites = function () {
        var RESTAURANTS_CLASS = 'Restaurants';
        var FAVOURITES_ATTRIBUTE = 'savedRestaurants';
        var RESTAURANT_ID_COLUMN = 'foursquareId';

        var parseUserPointer = null;
        var foursquarePlaceId = '';

        // Private Methods
        var RestaurantPreference = function (parseUser, restaurantId) {
            parseUserPointer = parseUser;
            foursquarePlaceId = restaurantId;
        };

        var getFavouriteEntry = function () {
            var savedRestaurants = Parse.User.current().relation(FAVOURITES_ATTRIBUTE);
            return savedRestaurants.query()
                .equalTo(RESTAURANT_ID_COLUMN, foursquarePlaceId)
                .find();
        };

        var getRestaurant = function (foursquareId) {
            var Restaurants = Parse.Object.extend(RESTAURANTS_CLASS);
            var restaurantQuery = new Parse.Query(Restaurants)
                .equalTo(RESTAURANT_ID_COLUMN, foursquareId);

            return restaurantQuery.find()
                .then(function (results) {
                    console.log(results);
                    return results[0];
                });
        };

        // Public Methods
        RestaurantPreference.prototype.isFavourite = function () {
            return getFavouriteEntry()
                .then(function (results) {
                    return results.length ? true : false;
                });
        };

        RestaurantPreference.prototype.set = function (isFavourite) {
            var saveRestaurantsRelation = Parse.User.current().relation(FAVOURITES_ATTRIBUTE);
            return getRestaurant(foursquarePlaceId)
                .then(function (restaurant) {
                    if (isFavourite) {
                        saveRestaurantsRelation.add(restaurant);
                    } else {
                        saveRestaurantsRelation.remove(restaurant);
                    }
                    return Parse.User.current().save();
                });
        };
        return RestaurantPreference;
    };

    angular.module('kiwii').
        factory('RestaurantPreference', Favourites);
})();
