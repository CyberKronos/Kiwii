(function() {
  var Actions = function($rootScope, $localStorage, $cordovaFacebook) { 

    var handleLookup = function(handle) {
      var query = new Parse.Query(Parse.User);
      query.equalTo("handle", handle);
      return query.find()
        .then(function(result) {
          return result;
        }, function(error) {
          return error;
        });
    };

    return {
      facebookLogin: function() {
        return $cordovaFacebook.getLoginStatus()
          .then(function (success) {
            if (success.authResponse === undefined) {
              return $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                .then(
                  function(success) {
                    console.log(success);
                    if (!success.authResponse){
                      console.log("Cannot find the authResponse");
                      return;
                    }
                    var expDate = new Date(
                      new Date().getTime() + success.authResponse.expiresIn * 1000
                      ).toISOString();

                    var authData = {
                      id: String(success.authResponse.userID),
                      access_token: success.authResponse.accessToken,
                      expiration_date: expDate
                    }

                    return Parse.FacebookUtils.logIn(authData);
                  }, function(error) {
                    console.log(error);
                  }
                )
                .then(
                  function(userObject) {
                    if (!userObject.existed()) {
                      return $cordovaFacebook.api("/me", ["public_profile"])
                      .then(function(response) {
                        userObject.set('fbId', response.id);
                        userObject.set('firstname', response.first_name);
                        userObject.set('lastname', response.last_name);
                        userObject.set('email', response.email);
                        userObject.save();

                        return $cordovaFacebook.api("/me/picture?redirect=false&width=500&height=500", ["public_profile"])
                        .then(function(response){
                          userObject.set('fbPicture', response.data.url);
                          userObject.save();

                          console.log(userObject.attributes); 
                          
                          // Save to cache after successful login.
                          var profileInfo = {
                            fbId: userObject.attributes.fbId, 
                            email: userObject.attributes.email, 
                            fbPicture: userObject.attributes.fbPicture,
                            firstname: userObject.attributes.firstname,
                            lastname: userObject.attributes.lastname,
                            username: userObject.attributes.username 
                          };

                          console.log("User signed up through Facebook!");

                          // TODO: move to store.js
                          $localStorage.$default({
                            profileInfo: profileInfo
                          });

                          return $rootScope.currentUser = profileInfo;
                        }, function(error) {
                          console.log(error);
                        });
                      }, function(error) {
                        console.log(error);
                      });
                    } else {
                      console.log(userObject);
                      console.log("User logged in through Facebook!");
                      $rootScope.currentUser = userObject.attributes;
                      return 'existing user';
                    }
                  }, function(error) {
                    console.log(error);
                  }
                );
            } else {
              var expDate = new Date(
                new Date().getTime() + success.authResponse.expiresIn * 1000
                ).toISOString();
              var authData = {
                id: String(success.authResponse.userID),
                access_token: success.authResponse.accessToken,
                expiration_date: expDate
              }
              return Parse.FacebookUtils.logIn(authData)
                .then(function (userData) {
                  console.log(userData);
                  return 'existing user';
                });
            }
          }, function (error) {
            console.log(error);
            return error;
          });
      },

      createHandle: function(userHandle, userObject) {
        return handleLookup(userHandle.handle)
          .then(function(result) {
            if (result[0]) {
              return 'Handle is taken';
            } else {
              userObject.set('handle', userHandle.handle);
              return userObject.save();
            }
          });
      },

      logout: function() {
        delete $localStorage.profileInfo;
        return Parse.User.logOut();
      }

      // login: function(username, password) {
      //   return Parse.User.logIn(username, password)
      //   .then(
      //     function(user) {
      //       // Save to cache after successful login.
      //       var profileInfo = {    
      //         username: user.attributes.username,
      //         firstname: user.attributes.firstname,
      //         lastname: user.attributes.lastname,
      //         email: user.attributes.email
      //       };
      //       // move to store.js
      //       $localStorage.$default({
      //         profileInfo: profileInfo
      //       });
      //       return; 
      //     }, function(error) {
      //       // The login failed. Check error to see why.
      //       // var message = 'Incorrect username and password combination';
      //       return error.message;
      //     }
      //   );
      // },

      // register: function(username, firstname, lastname, email, password) {
      //   var user = new Parse.User();
      //   user.set("username", username);
      //   user.set("firstname", firstname);
      //   user.set("lastname", lastname);
      //   user.set("email", email); 
      //   user.set("password", password);
      //   return user.signUp(null)
      //   .then(
      //     function(user) {
      //       // Hooray! Let them use the app now.
      //       console.log(user);
      //       // Save to cache after successful login.
      //       var profileInfo = {    
      //         username: username,
      //         firstname: firstname,
      //         lastname: lastname,
      //         email: email
      //       };
      //       // move to store.js
      //       $localStorage.$default({
      //         profileInfo: profileInfo
      //       });
      //       return;
      //     }, function(error) {
      //       return error.message;
      //     }
      //   );
      // },
    }
  };

  angular.module('kiwii').factory('Actions', Actions)
})();
