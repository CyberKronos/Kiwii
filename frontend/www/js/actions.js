(function() {
  var Actions = function(FlixApi, Store, Dispatcher, ApiConstants, AppConstants, auth, $localStorage, $cordovaFacebook) {
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
              return $cordovaFacebook.api("/me", ["public_profile"]);
            } else {
              // $state.go('tab.dash', {});
              console.log(userObject);
              console.log("User logged in through Facebook!");
              return;
            }
          }, function(error) {
            console.log(error);
          }
        );
        // .then(
        //   function(response) {
        //     userObject.set('firstname', response.first_name);
        //     userObject.set('lastname', response.last_name);
        //     userObject.set('email', response.email);
        //     userObject.save();

        //     var profilePicParams = {
        //       "type": "square",
        //       "height": "300",
        //       "width": "300"
        //     }

        //     return $cordovaFacebook.api("/me/picture", profilePicParams);
        //   }, function(error) {
        //     console.log(error);
        //   }
        // )
        // .then(
        //   function(response) {
        //     userObject.set('fbPicture', response.data.url);
        //     userObject.save();

        //     // $state.go('tab.dash', {});
        //     console.log("User signed up through Facebook!");

        //     console.log(userObject.attributes); 
            
        //     // Save to cache after successful login.
        //     var profileInfo = {   
        //       email: userObject.attributes.email, 
        //       fbPicture: userObject.attributes.fbPicture,
        //       firstname: userObject.attributes.firstname,
        //       lastname: userObject.attributes.lastname,
        //       username: userObject.attributes.username 
        //     };

        //     // move to store.js
        //     return $localStorage.$default({
        //       profileInfo: profileInfo
        //     });
        //   }, function(error) {
        //     console.log(error);
        //   }
        // );
            
        // $cordovaFacebook.login(["public_profile", "email", "user_friends"])
        // .then(function(response) {
        //   console.log(response);
        //   if (!response.authResponse){
        //     console.log("Cannot find the authResponse");
        //     return;
        //   }
        //   var expDate = new Date(
        //     new Date().getTime() + response.authResponse.expiresIn * 1000
        //     ).toISOString();

        //   var authData = {
        //     id: String(response.authResponse.userID),
        //     access_token: response.authResponse.accessToken,
        //     expiration_date: expDate
        //   }

        //   return Parse.FacebookUtils.logIn(authData, {
        //     success: function(userObject) {
        //       if (!userObject.existed()) {
        //         $cordovaFacebook.api("/me", ["public_profile"])
        //         .then(function(response) {
        //           userObject.set('firstname', response.first_name);
        //           userObject.set('lastname', response.last_name);
        //           userObject.set('email', response.email);
        //           userObject.save();
        //         }, function(error) {
        //           console.log(error);
        //         });
        //         var profilePicParams = {
        //           "type": "square",
        //           "height": "300",
        //           "width": "300"
        //         }
        //         $cordovaFacebook.api("/me/picture", profilePicParams)
        //         .then(function(response) {
        //           userObject.set('fbPicture', response.data.url);
        //           userObject.save();
        //         }, function(error) {
        //           console.log(error);
        //         });

        //         $state.go('tab.dash', {});
        //         console.log("User signed up through Facebook!");
        //       } else {
        //         $state.go('tab.dash', {});
        //         console.log("User logged in through Facebook!");
        //       }

        //       setTimeout( function() { 
        //           console.log(userObject.attributes); 
        //           // Save to cache after successful login.
        //           var profileInfo = {   
        //             email: userObject.attributes.email, 
        //             fbPicture: userObject.attributes.fbPicture,
        //             firstname: userObject.attributes.firstname,
        //             lastname: userObject.attributes.lastname,
        //             username: userObject.attributes.username 
        //           };
        //           $localstorage.setObject('profileInfo', profileInfo);
        //         }, 2000);
        //     },
        //     error: function(userObject, error) {
        //       console.log("User cancelled the Facebook login or did not fully authorize.");
        //     }
        //   });
        // }, function (error) {
        //   // error
        //   console.log(error);
        // });
      },

      logout: function() {
        Parse.User.logOut();
        delete $localStorage.profileInfo;
        var currentUser = Parse.User.current();  // this will now be null
        console.log(currentUser);
        $state.go('start');
      },

      // Old stuff to clean out
      logIn: function(profile, token, accessToken, state, refreshToken) {
        payload = {
          actionType: AppConstants.SET_CURRENT_USER,
          data: {
            profile: profile,
            token: token,
            accessToken: accessToken,
            refreshToken: refreshToken,
            state: state
          }
        }

        Dispatcher.handleServerAction(payload);
      },

      logOut: function() {
        payload = {
          actionType: AppConstants.LOG_OUT
        }

        Dispatcher.handleViewAction(payload);
        auth.signout();
      },

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
