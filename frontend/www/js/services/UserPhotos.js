(function () {
  var UserPhotos = function ($q, ParseObject, FoursquareApi, FacebookApi, InstagramApi) {

    var USER_PHOTOS_CLASS = 'UserPhotos';
    var UPLOADED_PHOTOS_ATTRIBUTE = 'uploadedPhotos';
    var USER_PHOTOS_KEYS = ['actor', 'description', 'photo', 'restaurant'];

    function saveImage(file) {
      var base64pic = file['imageData'];
      var parseFile = new Parse.File("photo.jpg", {base64: base64pic});
      return parseFile.save()
        .then(function (parseFileImage) {
          file['photo'] = parseFileImage;
          return file;
        })
        .fail(function (error) {
          return $q.reject('Error with saving image data: ' + error.message);
        });
    }

    function saveUserPhoto(userPhotoData) {
      var userPhotoPromise = $q.when(function () {
        var Photos = Parse.Object.extend(USER_PHOTOS_CLASS);
        var userPhoto = new Photos();
        var user = Parse.User.current();

        // we write to the user feed
        userPhoto.set('feedSlug', 'user');
        userPhoto.set('feedUserId', user.id);
        // the photo's data
        userPhoto.set('actor', user);
        userPhoto.set('verb', 'photo');
        userPhoto.set('description', userPhotoData['description']);
        userPhoto.set('photo', userPhotoData['photo']);

        if (userPhotoData['foursquareId']) {
          return FoursquareApi.getRestaurantById(userPhotoData['foursquareId'])
            .then(function (restaurant) {
              userPhoto.set('restaurant', restaurant);
              return userPhoto;
            });
        } else {
          return userPhoto;
        }
      }());
      return userPhotoPromise
        .then(function (userPhoto) {
          return userPhoto.save();
        })
        .catch(function (error) {
          return $q.reject('Error with saving to UserPhotos Class on Parse: ' + error.message);
        });
    }

    function linkPhotoToCurrentUser(userPhoto) {
      var photoAuthor = userPhoto.get('actor');
      var saveUploadedPhotosRelation = photoAuthor.relation(UPLOADED_PHOTOS_ATTRIBUTE);
      saveUploadedPhotosRelation.add(userPhoto);
      return photoAuthor.save()
        .then(function () {
          return userPhoto;
        })
        .fail(function (error) {
          return $q.reject('Error adding photo to user profile: ' + error.message);
        });
    }

    function getUserPhotosByParseObject(filter) {
      var query = new Parse.Query(USER_PHOTOS_CLASS);
      if (filter.restaurant) {
        query.equalTo('restaurant', filter.restaurant);
      }
      if (filter.user) {
        query.equalTo('actor', filter.user);
      }
      return query
        .descending('createdAt')
        .find();
    }

    var UserPhotos = ParseObject.extend(USER_PHOTOS_CLASS, USER_PHOTOS_KEYS, {}, {
      /**
       * Saves a user photo
       * @param file {Object} with the following attributes:
       *  imageData - the image file
       *  description - description of the photo
       *  foursquareId - the Foursquare ID of the tagged restaurant.
       * @returns {Promise} - the promise of a created UserPhoto object.
       */
      savePhoto: function (file) {
        return saveImage(file)
          .then(saveUserPhoto)
          .then(linkPhotoToCurrentUser);
      },
      /**
       * Gets user photos based on a query.
       * @param options {Object} may have the following attributes:
       *  restaurantId - foursquareId of a restaurant
       *  userId - the Facebook ID of a user
       *  withExternalSource - currently only allows 'instagram', restaurantId
       *    should be included if this is used
       * @returns {Promise} - the promise that returns an array of UserPhotos
       */
      getPhotos: function (options) {
        var filterQ = {
          restaurant: !_.has(options, 'restaurantId') ? $q.when()
            : FoursquareApi.getRestaurantById(options['restaurantId']),
          user: !_.has(options, 'userId') ? $q.when()
            : FacebookApi.getUserByFbId(options['userId'])
        };
        var photosQ = $q.all(filterQ)
          .then(getUserPhotosByParseObject);

        if (options['withExternalSource'] === 'instagram' && options['restaurantId']) {
          photosQ = $q.all([photosQ, InstagramApi.getLocationImages(options['restaurantId'])])
            .then(_.flatten);
        }
        return photosQ
          .catch(function () {
            return {message: 'Unable to fetch photos.'};
          });
      }
    });

    return UserPhotos;
  };

  angular.module('kiwii')
    .factory('UserPhotos', UserPhotos);
})();