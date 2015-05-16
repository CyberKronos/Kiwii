(function() {
    var Favourites = function() {
        var FAVOURITES_CLASS = 'Favourites';
        var PLACE_ID_COLUMN = 'foursquarePlaceId';
        var USER_COLUMN = 'user';

        var parseUserPointer = null;
        var foursquarePlaceId = '';

        // Private Methods
        var RestuarantPreference = function(parseUser, restuarantId) {
            parseUserPointer = parseUser;
            foursquarePlaceId = restuarantId;
        };

        var getFavouriteEntry = function() {
            return new Parse.Query(FAVOURITES_CLASS)
                .equalTo(PLACE_ID_COLUMN, foursquarePlaceId)
                .equalTo(USER_COLUMN, parseUserPointer)
                .find()
                .then(function (results) {
                    if (results.length) {
                        return results[0];
                    }
                });
        };

        var makeFavouriteEntry = function() {
            var Favourites = Parse.Object.extend(FAVOURITES_CLASS);
            return new Favourites()
                .set(PLACE_ID_COLUMN, foursquarePlaceId)
                .set(USER_COLUMN, parseUserPointer)
                .save();
        };

        // Public Methods
        RestuarantPreference.prototype.isFavourite = function() {
            return getFavouriteEntry()
                .then(function(entry) {
                    return entry ? true : false;
                });
        };
        RestuarantPreference.prototype.toggle = function() {
            var self = this;
            return getFavouriteEntry()
                .then(function (entry) {
                    return entry ? entry.destroy() : makeFavouriteEntry();
                })
                .then(function() {
                    return self.isFavourite();
                });
        };

        return RestuarantPreference;
    };

    angular.module('app').
        factory('RestuarantPreference', Favourites);
})();
