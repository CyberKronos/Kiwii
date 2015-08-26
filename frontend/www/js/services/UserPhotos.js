(function () {
  var UserPhotos = function () {

    var RESTAURANTS_CLASS = 'Restaurants';
    var RESTAURANT_ID_COLUMN = 'foursquareId';

    var USER_PHOTOS_CLASS = 'UserPhotos';
    var UPLOADED_PHOTOS_ATTRIBUTE = 'uploadedPhotos';

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

    /* Public Interface */
    return {
      savePhoto: function (file) {
        var base64pic = file['imageData'];
        var parseFile = new Parse.File("photo.jpg", { base64: base64pic });

        return parseFile.save().then(function() {
          var Photos = Parse.Object.extend(USER_PHOTOS_CLASS);

          var photo = new Photos();
          var user = Parse.User.current();
          // we write to the user feed
          photo.set('feedSlug', 'user');
          photo.set('feedUserId', user.id);
          // the photo's data
          photo.set('actor', user);
          photo.set('verb', 'photo');
          photo.set("description", file['description']);
          photo.set("photo", parseFile);
          // photo.set("restaurant", file['restaurantObject']);

          return photo.save().then(function() {
            var saveUploadedPhotosRelation = Parse.User.current().relation(UPLOADED_PHOTOS_ATTRIBUTE);
            saveUploadedPhotosRelation.add(photo);

            return Parse.User.current().save()
            .then(function(){
              if (file['foursquareId']) {
                return getRestaurant(file['foursquareId'])
                .then(function (restaurant) {
                  console.log(restaurant);
                  photo.set('restaurant', restaurant);
    
                  return photo.save()
                  .then(function() {
                    var msg = "The photo has been saved to Parse";
                    return msg;
                  });
                });
              } else {
                return photo.save()
                .then(function() {
                  var msg = "The photo has been saved to Parse";
                  return msg;
                });
              }
            });
          }, function() {
            var msg = "Error with saving to UserPhotos Class on Parse";
            return msg;
          });
        }, function() {
          var msg = "There has been an error. Try again.";
          return msg;
        });
      }
    };
  };

  angular.module('kiwii')
    .factory('UserPhotos', UserPhotos);
})();