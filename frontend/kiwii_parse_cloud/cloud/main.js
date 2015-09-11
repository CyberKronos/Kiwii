require('cloud/foursquareApi.js');
require('cloud/restaurantsAfterSave.js');

// Instagram Api
var ig = require('cloud/instagram-v1-1.0.js');
// Paste your client_id here
ig.initialize('83917d76cf494eb1a888bec8282f8611');
// Paste your access_token here if needed
ig.setAccessToken('10540106.83917d7.5369ddd80fec497da72ebce95b235cd5');

Parse.Cloud.define('searchLocation', function (request, response) {
  ig.searchLocation({
    foursquare_v2_id: request.params.foursquareId
  }).then(function (httpResponse) {
      response.success(httpResponse.data);
    },
    function (error) {
      response.error(error);
    });
});

Parse.Cloud.define('getRecentMediaByLocation', function (request, response) {
  ig.getRecentMediaByLocation(request.params.locationId, {})
    .then(function (httpResponse) {
      response.success(httpResponse.data);
    },
    function (error) {
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

var stream = require('cloud/getstream.js');
var utils = require('cloud/utils.js');
var settings = require('cloud/settings.js');
var _ = require('underscore');

// initialize the getstream.io client
var client = stream.connect(settings.streamApiKey, settings.streamApiSecret, settings.streamApp);

/*
 * Listen to the activityModels afterSave and afterDelete
 * and send the activities to getstream.io
 */
_.each(settings.activityModels, function(model) {
  Parse.Cloud.afterSave(model, function(request) {
    // trigger fanout
    var activity = utils.parseToActivity(request.object);
    var feed = client.feed(activity.feed_slug, activity.feed_user_id);
    feed.addActivity(activity, utils.createHandler());
  });

  Parse.Cloud.afterDelete(model, function(request) {
    // trigger fanout to remove
    var activity = utils.parseToActivity(request.object);
    var feed = client.feed(activity.feed_slug, activity.feed_user_id);
    // remove by foreign id
    feed.removeActivity({
      foreignId : activity.foreign_id
    }, utils.createHandler());
  });
});

/*
 * Sync the follow state to getstream.io
 *
 * Not being used since we are not using a Follow class to save folloing activity
 */
Parse.Cloud.afterSave(settings.followModel, function(request) {
  // trigger fanout & follow
  var parseObject = request.object;
  var activity = utils.parseToActivity(parseObject);
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  feed.addActivity(activity, utils.createHandler());
  // flat feed of user will follow user feed of target
  var flat = client.feed('flat', parseObject.get('actor').id);
  flat.follow('user', parseObject.get('object').id, utils.createHandler());
});

Parse.Cloud.afterDelete(settings.followModel, function(request) {
  // trigger fanout & unfollow
  var parseObject = request.object;
  var activity = utils.parseToActivity(parseObject);
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  feed.removeActivity({
    foreignId : activity.foreign_id
  }, utils.createHandler());
  // flat feed of user will follow user feed of target
  var flat = client.feed('flat', parseObject.get('actor').id);
  flat.unfollow('user', parseObject.get('object').id, utils.createHandler());
});

/*
 * Newly added restaurant to a list - add to user feed
 * Accepts params
 */

Parse.Cloud.define("addRestaurantToListActivity", function(request, response) {
  // trigger fanout
  var feedIdentifier = request.params.feed;
  var feedParts = feedIdentifier.split(':');
  var feedSlug = feedParts[0];
  var userId = feedParts[1];

  var actor = request.params.actor;
  var object = request.params.object;
  var foreign_id = request.params.foreign_id;
  var target = request.params.target;

  var activity = {
    feed_slug: feedSlug,
    feed_user_id: userId,
    actor: actor, 
    verb: 'listUpdate', 
    object: object,
    foreign_id: foreign_id,
    target: target
  }
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  feed.addActivity(activity, utils.createHandler());
  response.success('success!');
});

/*
 * Remove a restaurant in a list - remove from user feed
 * Accepts params
 */

Parse.Cloud.define("removeRestaurantFromListActivity", function(request, response) {
  // trigger fanout
  var feedIdentifier = request.params.feed;
  var feedParts = feedIdentifier.split(':');
  var feedSlug = feedParts[0];
  var userId = feedParts[1];

  var foreign_id = request.params.foreign_id;

  var activity = {
    feed_slug: feedSlug,
    feed_user_id: userId,
    foreign_id: foreign_id
  }
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  // remove by foreign id
  feed.removeActivity({
    foreignId : activity.foreign_id
  }, utils.createHandler());
  response.success('success!');
});

/*
 * View to retrieve the feed, expects feed in the format user:1
 * Accepts params
 *
 * feed: the feed id in the format user:1
 * limit: how many activities to get
 * id_lte: filter by activity id less than or equal to (for pagination)
 *
 */
Parse.Cloud.define("feed", function(request, response) {
  var feedIdentifier = request.params.feed;
  var feedParts = feedIdentifier.split(':');
  var feedSlug = feedParts[0];
  var userId = feedParts[1];
  var id_lte = request.params.id_lte || undefined;
  var limit = request.params.limit || 100;
  var params = {
    limit : limit
  };
  if (id_lte) {
    params.id_lte = limit;
  }
  // initialize the feed class
  var feed = client.feed(feedSlug, userId);
  feed.get(params, function(httpResponse) {
    var activities = httpResponse.data;
    // enrich the response with the database values where needed
    var promise = utils.enrich(activities.results);
    promise.then(function(activities) {
      response.success({
        activities : activities,
        feed : feedIdentifier,
        token : feed.token
      });
    });
  }, utils.createHandler(response));
});

/*
 * Bit of extra logic for likes
 */

Parse.Cloud.afterSave("Like", function(request) {
  // trigger fanout
  var activity = utils.parseToActivity(request.object);
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  feed.addActivity(activity, utils.createHandler());
  // get the related object
  var like = request.object;
  var activityType = like.get('activity_type');
  var pointer = like.get('activity_' + activityType);
  var query = new Parse.Query(pointer.className);
  query.get(pointer.id, function(activity){
    // increment the likes
    activity.increment('likes');
    activity.save();
  });
});

Parse.Cloud.afterDelete("Like", function(request) {
  // trigger fanout to remove
  var activity = utils.parseToActivity(request.object);
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  // remove by foreign id
  feed.removeActivity({
    foreignId : activity.foreign_id
  }, utils.createHandler());
  // get the related object
  var like = request.object;
  var activityType = like.get('activity_type');
  var pointer = like.get('activity_' + activityType);
  var query = new Parse.Query(pointer.className);
  query.get(pointer.id, function(activity){
    // decrement the likes
    activity.increment('likes', -1);
    activity.save();
  });
});



