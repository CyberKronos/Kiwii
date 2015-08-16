(function () {
    var FacebookApi = function ($cordovaFacebook) {
        /* Private Methods */

        /* Public Interface */
        return {
            getFriendsInApp: function() {
                if (!window.cordova) {
                    var appId = 1597756577154303;
                    facebookConnectPlugin.browserInit(appId);
                }
                return $cordovaFacebook.getLoginStatus()
                .then(function(success) {
                    console.log(success);
                    return $cordovaFacebook.api("/me/friends", ["public_profile", "user_friends"])
                    .then(function(response){
                        console.log(response);
                        return response;
                    }, function(error) {
                        console.log(error);
                    });
                }, function (error) {
                    console.log(error);
                });
            }
        }
    };

    angular.module('kiwii')
        .factory('FacebookApi', ['$cordovaFacebook', FacebookApi]);
})();