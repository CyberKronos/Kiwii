(function() {
  var Actions = function($rootScope, FlixApi, Store, Dispatcher, ApiConstants, AppConstants, auth, $localStorage, $cordovaFacebook) {
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
      },

      // Old stuff to clean out
      // logIn: function(profile, token, accessToken, state, refreshToken) {
      //   payload = {
      //     actionType: AppConstants.SET_CURRENT_USER,
      //     data: {
      //       profile: profile,
      //       token: token,
      //       accessToken: accessToken,
      //       refreshToken: refreshToken,
      //       state: state
      //     }
      //   }

      //   Dispatcher.handleServerAction(payload);
      // },

      // logOut: function() {
      //   payload = {
      //     actionType: AppConstants.LOG_OUT
      //   }

      //   Dispatcher.handleViewAction(payload);
      //   auth.signout();
      // },

      updateAuthToken: function(newToken) {
        payload = {
          actionType: AppConstants.UPDATE_AUTH_TOKEN,
          token: newToken
        }

        Dispatcher.handleServerAction(payload);
      },

      resetPreferences: function() {
        payload = {
          actionType: AppConstants.RESET_PREFS
        }

        Dispatcher.handleViewAction(payload);
      },

      updatePrefs: function(prefs) {
        payload = {
          actionType: AppConstants.UPDATE_PREFS,
          newPrefs: prefs
        }

        Dispatcher.handleViewAction(payload);
      },

      fetchShows: function(options) {
        var userEmail = (Store.getCurrentUser() || {}).email,
            prefs = angular.copy(Store.getPrefs());

        if (typeof options == 'undefined') { options = {} }
        prefs = angular.extend(prefs, options);
        FlixApi.fetchShows(prefs, userEmail);
      },

      fetchLikedShows: function() {
        var userEmail = (Store.getCurrentUser() || {}).email;

        FlixApi.fetchLikedShows(userEmail);
      },

      likeShow: function(showId) {
        var userEmail = (Store.getCurrentUser() || {}).email;
        FlixApi.likeShow(showId, userEmail);
      },

      dislikeShow: function(showId) {
        var userEmail = (Store.getCurrentUser() || {}).email;
        FlixApi.dislikeShow(showId, userEmail);
      },

      setRegion: function(newRegion) {
        payload = {
          actionType: AppConstants.SET_REGION,
          region: newRegion
        }

        Dispatcher.handleServerAction(payload);
      },

      exclusivelySelectGenre: function(genre) {
        payload = {
          actionType: AppConstants.EXCLUSIVELY_SELECT_GENRE,
          genre: genre
        }

        Dispatcher.handleViewAction(payload);
      }
    }
  }

  angular.module('app').factory('Actions', Actions)
})();
