var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var CONSTANTS = require('../../lib/constants');
var ResultClient = require('../../lib/client/result-client');
var expect = chai.expect;
var Q = require('q');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

describe("Result List Mediator Topic", function() {

  var mockResult = {
    id: "resultid",
    name: "This is a mock Work Order"
  };

  var results = [_.clone(mockResult), _.clone(mockResult)];

  var listTopic = "wfm:results:list";

  var syncListTopic = "wfm:sync:result:list";

  var resultClient = ResultClient(mediator);

  var resultSubscribers = new MediatorTopicUtility(mediator);
  resultSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULT_ENTITY_NAME);

  beforeEach(function() {
    this.subscribers = {};
    resultSubscribers.on(CONSTANTS.TOPICS.LIST, require('../../lib/client/mediator-subscribers/list')(resultSubscribers, resultClient));
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    resultSubscribers.unsubscribeAll();
  });

  it('should use the sync topics to list results', function() {
    this.subscribers[syncListTopic] = mediator.subscribe(syncListTopic, function() {
      return Q.resolve(results);
    });

    return mediator.publish(listTopic).then(function(arrayOfResults) {
      expect(arrayOfResults).to.deep.equal(results);
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncListTopic] = mediator.subscribe(syncListTopic, function() {
      return Q.reject(expectedError);
    });

    return mediator.publish(listTopic).catch(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});