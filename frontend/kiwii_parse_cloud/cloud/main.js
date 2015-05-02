
// Use Parse.Cloud.define to define as many cloud functions as you want.

// Instagram Api
// Copy the cloud module in your cloud folder
var ig = require('cloud/instagram-v1-1.0.js');
// Paste your client_id here
ig.initialize('83917d76cf494eb1a888bec8282f8611');
// Paste your access_token here if needed
ig.setAccessToken('10540106.83917d7.5369ddd80fec497da72ebce95b235cd5');

Parse.Cloud.define('searchLocation', function(request, response) {
  ig.searchLocation({
    foursquare_v2_id: request.params.foursquareId
  }).then(function(httpResponse) {
    response.success(httpResponse.data);
  },
  function(error) {
    response.error(error);
  });
});

Parse.Cloud.define('getRecentMediaByLocation', function(request, response) {
  ig.getRecentMediaByLocation(request.params.locationId, {})
  .then(function(httpResponse) {
    response.success(httpResponse.data);
  },
  function(error) {
    response.error(error);
  });
});

// Parse.Cloud.define('searchTag', function(request, response) {
//   ig.searchTag({
//     q: 'latergram'
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('searchUser', function(request, response) {
//   ig.searchUser({
//     q: 'jack',
//     count: '3'
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getUser', function(request, response) {
//   ig.getUser('1574083', {}).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getTag', function(request, response) {
//   ig.getTag('latergram', {}).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getLocation', function(request, response) {
//   ig.getLocation('1', {}).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getPopularMedia', function(request, response) {
//   ig.getPopularMedia({
//     count:'3'
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getRecentMediaByUser', function(request, response) {
//   ig.getRecentMediaByUser('3', {
//     count: '1'
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getRecentMediaByTag', function(request, response) {
//   ig.getRecentMediaByTag('latergram', {
//     count: '1'
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getSelfFeed', function(request, response) {
//   ig.getSelfFeed({
//     count:'1'
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('getSelfLikedMedia', function(request, response) {
//   ig.getSelfLikedMedia({
//     count:'1'
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
//   function(error) {
//     response.error(error);
//   });
// });

// Parse.Cloud.define('testPagination', function(request, response) {
//   ig.getSelfFeed({}).then(function(httpResponse) {
//     var nextUrl = httpResponse.data.pagination.next_url;
//     return ig.getNextPage(nextUrl);
//   }).then(function(httpResponse) {
//     response.success(httpResponse.data);
//   },
// 	function(error) {
//     response.error(error);
//   });
// });

// Foursquare Api
Parse.Cloud.define("callFoursquareApi", function(request, response) {
  Parse.Cloud.httpRequest({
    method: "GET",
    url: request.params.url,
    success: function (httpResponse) {
      response.success(httpResponse);
    },
    error: function (httpResponse) {
      response.error("Request failed with response code:" + httpResponse.status + " Message: " + httpResponse.text);
    }
  });
});

