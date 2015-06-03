(function() {
  var Actions = function($rootScope, Store, Dispatcher, ApiConstants, AppConstants, $localStorage, $cordovaFacebook) {
    return {
      login: function(username, password) {
        return Parse.User.logIn(username, password, {
          success: function(user) {
            // Save to cache after successful login.
            var profileInfo = {    
              username: user.attributes.username,
              firstname: user.attributes.firstname,
              lastname: user.attributes.lastname,
              email: user.attributes.email
            };
            // move to store.js
            $localStorage.$default({
              profileInfo: profileInfo
            });
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            console.log("error");
            // var message = 'Incorrect username and password combination';
            // Alerts.error(message);
          }
        }); 
      },

      facebookLogin: function() {
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
                userObject.set('firstname', response.first_name);
                userObject.set('lastname', response.last_name);
                userObject.set('email', response.email);
                userObject.save();

                return $cordovaFacebook.api("/me/picture?type=large")
                .then(function(response){
                  userObject.set('fbPicture', response.data.url);
                  userObject.save();

                  console.log(userObject.attributes); 
                  
                  // Save to cache after successful login.
                  var profileInfo = {   
                    email: userObject.attributes.email, 
                    fbPicture: userObject.attributes.fbPicture,
                    firstname: userObject.attributes.firstname,
                    lastname: userObject.attributes.lastname,
                    username: userObject.attributes.username 
                  };

                  console.log("User signed up through Facebook!");

                  // TODO: move to store.js
                  return $localStorage.$default({
                    profileInfo: profileInfo
                  });

                  $rootScope.currentUser = profileInfo;
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
              return;
            }
          }, function(error) {
            console.log(error);
          }
        );
      },

      register: function(username, firstname, lastname, email, password) {
        var user = new Parse.User();
        user.set("username", username);
        user.set("firstname", firstname);
        user.set("lastname", lastname);
        user.set("email", email); 
        user.set("password", password);
        return user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                console.log(user);
                // Save to cache after successful login.
                var profileInfo = {    
                  username: username,
                  firstname: firstname,
                  lastname: lastname,
                  email: email
                };
                // move to store.js
                $localStorage.$default({
                  profileInfo: profileInfo
                });
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                console.log("Error: " + error.code + " " + error.message);
                // var message = "Error: " + error.code + " " + error.message;
                // Alerts.error(message);
            }
        });
      },

      logout: function() {
        delete $localStorage.profileInfo;
        return Parse.User.logOut();
      }
    }
  };

  angular.module('app').factory('Actions', Actions)
})();
