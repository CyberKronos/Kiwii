(function () {
  var UserPhotos = function () {

    var USER_PHOTOS_CLASS = 'UserPhotos';

    var UPLOADED_PHOTOS_ATTRIBUTE = 'uploadedPhotos';

    /* Public Interface */
    return {
      savePhoto: function (file) {
        var Photos = Parse.Object.extend(USER_PHOTOS_CLASS);

        var photoName = "photo.jpeg";
        var imageURI = file.imageURI;
        var parseFile = new Parse.File(photoName, imageURI);

        return parseFile.save().then(function() {
          // The file has been saved to Parse.
          var saveUploadedPhotosRelation = Parse.User.current().relation(UPLOADED_PHOTOS_ATTRIBUTE);
          saveUploadedPhotosRelation.add(parseFile);

          return Parse.User.current().save();
        });
      }
    };
  };

  angular.module('kiwii')
    .factory('UserPhotos', UserPhotos);
})();