var _ = require('lodash');
var topicHandlers = {
  create: require('./create'),
  update: require('./update'),
  remove: require('./remove'),
  list: require('./list'),
  read: require('./read'),

  //sync notification subscribe handlers
  syncEvent: require('./sync-events')
};

var CONSTANTS = require('../../constants');
var config = require('../../config');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var resultSubscribers;
var syncSubscribers;

module.exports = {
  /**
   * Initialisation of all the topics that this module is interested in.
   * @param mediator     - The Mediator.
   * @param resultClient - The client used for performing result operations.
   * @returns {Topics|exports|module.exports|*}
   */
  init: function(mediator, resultClient) {

    //If there is already a set of subscribers set up, then don't subscribe again.
    if (resultSubscribers) {
      return resultSubscribers;
    }

    resultSubscribers = new MediatorTopicUtility(mediator);
    resultSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULT_ENTITY_NAME);

    //Setting up subscribers to the result topics.
    _.each(CONSTANTS.TOPICS, function(topicName) {
      if (topicHandlers[topicName]) {
        resultSubscribers.on(topicName, topicHandlers[topicName](resultSubscribers, resultClient));
      }
    });

    if (syncSubscribers) {
      return syncSubscribers;
    }
    syncSubscribers = new MediatorTopicUtility(mediator);
    syncSubscribers.prefix(CONSTANTS.SYNC_TOPIC_PREFIX).entity(config.datasetId);

    _.each(CONSTANTS.SYNC_TOPICS, function(topicName) {
      syncSubscribers.on(topicName, topicHandlers.syncEvent());
    });


    return resultSubscribers;
  },
  tearDown: function() {
    if (resultSubscribers) {
      resultSubscribers.unsubscribeAll();
      resultSubscribers = null;
    }
    if (syncSubscribers) {
      syncSubscribers.unsubscribeAll();
      syncSubscribers = null;
    }
  }
};
