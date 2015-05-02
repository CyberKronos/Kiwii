(function() {
  var LoginCtrl = function($scope, $rootScope, $state, $localStorage) {
    $scope.loginObj = {};
    $scope.emailLogin = function() {
      Parse.User.logIn($scope.loginObj.username, $scope.loginObj.password, {
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
          $state.go('dash');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          console.log("error");
          // var message = 'Incorrect username and password combination';
          // Alerts.error(message);
        }
      }); 
    };

    // $scope.facebookLogin = function() {
    //   console.log('Login');
    //   if (!window.cordova) {
    //     var appId = 1594340540779035;
    //     facebookConnectPlugin.browserInit(appId);
    //   }

    //   $cordovaFacebook.login(["public_profile", "email", "user_friends"])
    //   .then(function(response) {
    //     console.log(response);
    //     if (!response.authResponse){
    //       console.log("Cannot find the authResponse");
    //       return;
    //     }
    //     var expDate = new Date(
    //       new Date().getTime() + response.authResponse.expiresIn * 1000
    //       ).toISOString();

    //     var authData = {
    //       id: String(response.authResponse.userID),
    //       access_token: response.authResponse.accessToken,
    //       expiration_date: expDate
    //     }

    //     return Parse.FacebookUtils.logIn(authData, {
    //       success: function(userObject) {
    //         if (!userObject.existed()) {
    //           $cordovaFacebook.api("/me", ["public_profile"])
    //           .then(function(response) {
    //             userObject.set('firstname', response.first_name);
    //             userObject.set('lastname', response.last_name);
    //             userObject.set('email', response.email);
    //             userObject.save();
    //           }, function(error) {
    //             console.log(error);
    //           });
    //           var profilePicParams = {
    //             "type": "square",
    //             "height": "300",
    //             "width": "300"
    //           }
    //           $cordovaFacebook.api("/me/picture", profilePicParams)
    //           .then(function(response) {
    //             userObject.set('fbPicture', response.data.url);
    //             userObject.save();
    //           }, function(error) {
    //             console.log(error);
    //           });

    //           $state.go('tab.dash', {});
    //           console.log("User signed up through Facebook!");
    //         } else {
    //           $state.go('tab.dash', {});
    //           console.log("User logged in through Facebook!");
    //         }

    //         setTimeout( function() { 
    //           console.log(userObject.attributes); 
    //                         // Save to cache after successful login.
    //                         var profileInfo = {   
    //                           email: userObject.attributes.email, 
    //                           fbPicture: userObject.attributes.fbPicture,
    //                           firstname: userObject.attributes.firstname,
    //                           lastname: userObject.attributes.lastname,
    //                           username: userObject.attributes.username 
    //                         };
    //                         $localstorage.setObject('profileInfo', profileInfo);
    //                       }, 2000);
    //       },
    //       error: function(userObject, error) {
    //         console.log("User cancelled the Facebook login or did not fully authorize.");
    //       }
    //     });
    //   }, function (error) {
    //     // error
    //     console.log(error);
    //   });
    // };
  }

  angular.module('app')
    .controller('LoginCtrl', LoginCtrl)
})();
