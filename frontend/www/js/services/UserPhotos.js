(function () {
  var UserPhotos = function () {

    var USER_PHOTOS_CLASS = 'UserPhotos';

    var UPLOADED_PHOTOS_ATTRIBUTE = 'uploadedPhotos';

    /* Public Interface */
    return {
      savePhoto: function (file) {
        var base64pic = file['imageData'];
        var parseFile = new Parse.File("photo.jpg", { base64: base64pic });

        return parseFile.save().then(function() {
          var Photos = Parse.Object.extend(USER_PHOTOS_CLASS);

          var photo = new Photos();
          photo.set("description", file['description']);
          photo.set("photo", parseFile);

          return photo.save().then(function() {
            var saveUploadedPhotosRelation = Parse.User.current().relation(UPLOADED_PHOTOS_ATTRIBUTE);
            saveUploadedPhotosRelation.add(photo);

            return Parse.User.current().save()
            .then(function(){
              var msg = "The photo has been saved to Parse";
              return msg;
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