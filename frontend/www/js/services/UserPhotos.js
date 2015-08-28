(function () {
  var UserPhotos = function ($q, FoursquareApi) {

    var USER_PHOTOS_CLASS = 'UserPhotos';
    var UPLOADED_PHOTOS_ATTRIBUTE = 'uploadedPhotos';

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
        })
    }

    /* Public Interface */
    return {
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
          .then(linkPhotoToCurrentUser)
          .then(function (userPhoto) {
            console.log('The photo has been saved to Parse');
            return userPhoto;
          });
      }
    };
  };

  angular.module('kiwii')
    .factory('UserPhotos', UserPhotos);
})();