var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var CONSTANTS = require('../../lib/constants');
var ResultClient = require('../../lib/client/result-client');
var expect = chai.expect;
var Q = require('q');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

describe("Result Read Mediator Topic", function() {

  var mockResult = {
    id: "resultid",
    name: "This is a mock Work Order"
  };

  var readTopic = "wfm:results:read";

  var syncReadTopic = "wfm:sync:result:read";

  var resultSubscribers = new MediatorTopicUtility(mediator);
  resultSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULT_ENTITY_NAME);

  var resultClient = ResultClient(mediator);

  var readSubscribers = require('../../lib/client/mediator-subscribers/read')(resultSubscribers, resultClient);

  beforeEach(function() {
    this.subscribers = {};
    resultSubscribers.on(CONSTANTS.TOPICS.READ, readSubscribers);
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    resultSubscribers.unsubscribeAll();
  });

  it('should use the sync topics to read result', function() {
    this.subscribers[syncReadTopic] = mediator.subscribe(syncReadTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');

      return Q.resolve(mockResult);
    });

    return  mediator.publish(readTopic, {id: mockResult.id}).then(function(readResult) {
      expect(readResult).to.deep.equal(mockResult);
    });
  });

  it('should publish an error if there is no ID to read', function() {
    return mediator.publish(readTopic).catch(function(error) {
      expect(error.message).to.have.string("Expected An ID");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncReadTopic] = mediator.subscribe(syncReadTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');

      return Q.reject(expectedError);
    });

    return mediator.publish(readTopic, {id: mockResult.id}).catch(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});