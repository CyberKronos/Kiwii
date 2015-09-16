require('cloud/foursquareApi.js');
require('cloud/restaurantsAfterSave.js');
var _ = require('underscore');
var ig = require('cloud/instagram-v1-1.0.js');
var moment = require('moment');

// Paste your client_id here
ig.initialize('83917d76cf494eb1a888bec8282f8611');
// Paste your access_token here if needed
ig.setAccessToken('10540106.83917d7.5369ddd80fec497da72ebce95b235cd5');

Parse.Cloud.define('getInstagramImagesByFoursquareId', function (request, response) {
  ig.searchLocation({
    foursquare_v2_id: request.params.foursquareId
  })
    .then(function (httpResponse) {
      return ig.getRecentMediaByLocation(httpResponse.data.data[0].id, {});
    })
    .then(function (httpResponse) {
      response.success(httpResponse.data);
    })
    .fail(
    function (error) {
      response.error(error);
    });
});

var stream = require('cloud/getstream.js');
var utils = require('cloud/utils.js');
var settings = require('cloud/settings.js');

// initialize the getstream.io client
var client = stream.connect(settings.streamApiKey, settings.streamApiSecret, settings.streamApp);

/*
 * Listen to the activityModels afterSave and afterDelete
 * and send the activities to getstream.io
 */
_.each(settings.activityModels, function (model) {
  Parse.Cloud.afterSave(model, function (request) {
    // trigger fanout
    if (!request.object.get('externalSource')) {
      var activity = utils.parseToActivity(request.object);
      var feed = client.feed(activity.feed_slug, activity.feed_user_id);
      feed.addActivity(activity, utils.createHandler());
    }
  });

  Parse.Cloud.afterDelete(model, function (request) {
    // trigger fanout to remove
    if (!request.object.get('externalSource')) {
      var activity = utils.parseToActivity(request.object);
      var feed = client.feed(activity.feed_slug, activity.feed_user_id);
      // remove by foreign id
      feed.removeActivity({
        foreignId: activity.foreign_id
      }, utils.createHandler());
    }
  });
});


/*
 * Newly added restaurant to a list - add to user feed
 * Accepts params
 */

Parse.Cloud.define("addRestaurantToListActivity", function (request, response) {
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
  };
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  feed.addActivity(activity, utils.createHandler());
  response.success('success!');
});

/*
 * Remove a restaurant in a list - remove from user feed
 * Accepts params
 */

Parse.Cloud.define("removeRestaurantFromListActivity", function (request, response) {
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
  };
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  // remove by foreign id
  feed.removeActivity({
    foreignId: activity.foreign_id
  }, utils.createHandler());
  response.success('success!');
});

/*
 * Sync the follow state to getstream.io
 *
 * Not being used since we are not using a Follow class to save folloing activity
 */
Parse.Cloud.afterSave(settings.followModel, function (request) {
  // trigger fanout & follow
  var parseObject = request.object;
  var activity = utils.parseToActivity(parseObject);
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  feed.addActivity(activity, utils.createHandler());
  // flat feed of user will follow user feed of target
  var flat = client.feed('flat', parseObject.get('actor').id);
  flat.follow('user', parseObject.get('object').id, utils.createHandler());
});

Parse.Cloud.afterDelete(settings.followModel, function (request) {
  // trigger fanout & unfollow
  var parseObject = request.object;
  var activity = utils.parseToActivity(parseObject);
  var feed = client.feed(activity.feed_slug, activity.feed_user_id);
  feed.removeActivity({
    foreignId: activity.foreign_id
  }, utils.createHandler());
  // flat feed of user will follow user feed of target
  var flat = client.feed('flat', parseObject.get('actor').id);
  flat.unfollow('user', parseObject.get('object').id, utils.createHandler());
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
Parse.Cloud.define("feed", function (request, response) {
  var feedIdentifier = request.params.feed;
  var feedParts = feedIdentifier.split(':');
  var feedSlug = feedParts[0];
  var userId = feedParts[1];
  var id_lte = request.params.id_lte || undefined;
  var limit = request.params.limit || 100;
  var params = {
    limit: limit
  };
  if (id_lte) {
    params.id_lte = limit;
  }
  // initialize the feed class
  var feed = client.feed(feedSlug, userId);
  feed.get(params, function (httpResponse) {
    var activities = httpResponse.data;
    // enrich the response with the database values where needed
    var promise = utils.enrich(activities.results);
    promise.then(function (activities) {
      var feedItems = _.map(activities, function (activity) {
        if (activity.verb == 'card') {
          var author = activity.object_parse.attributes.author;
          var taggedRestaurant = activity.object_parse.attributes.taggedRestaurant;
          var photo = activity.object_parse.attributes.photos[0];

          var p1 = author.fetch();
          var p2 = taggedRestaurant.fetch();
          var p3 = photo.fetch();

          return Parse.Promise.when(p1, p2, p3)
            .then(function () {
              return activity;
            });
        } else {
          return activity;
        }
      });

      return Parse.Promise.when(feedItems);
    })
      .then(function () {
        var activities = _.toArray(arguments);
        response.success({
          activities: activities,
          feed: feedIdentifier,
          token: feed.token
        });
      });
  }, utils.createHandler(response));
});
