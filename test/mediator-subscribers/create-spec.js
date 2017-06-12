var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var CONSTANTS = require('../../lib/constants');
var Q = require('q');

var expect = chai.expect;

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');
var ResultClient = require('../../lib/client/result-client');

describe("Result Create Mediator Topic", function() {

  var mockResultToCreate = {
    name: "This is a mock Work Order"
  };

  var expectedCreatedResult =  _.extend({_localuid: "createdResultLocalId"}, mockResultToCreate);

  var createTopic = "wfm:results:create";

  var syncCreateTopic = "wfm:sync:result:create";

  var resultSubscribers = new MediatorTopicUtility(mediator);
  resultSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULT_ENTITY_NAME);

  var resultClient = ResultClient(mediator);

  beforeEach(function() {
    this.subscribers = {};
    resultSubscribers.on(CONSTANTS.TOPICS.CREATE, require('../../lib/client/mediator-subscribers/create')(resultSubscribers, resultClient));
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    resultSubscribers.unsubscribeAll();
  });

  it('should use the sync topics to create a result', function() {
    this.subscribers[syncCreateTopic] = mediator.subscribe(syncCreateTopic, function(parameters) {
      expect(parameters.itemToCreate).to.deep.equal(mockResultToCreate);

      return Q.resolve(expectedCreatedResult);
    });

    return mediator.publish(createTopic, {
      resultToCreate: mockResultToCreate
    }).then(function(createdResult) {
      expect(createdResult).to.deep.equal(expectedCreatedResult);
    });
  });

  it('should publish an error if there is no object to update', function() {
    return mediator.publish(createTopic, {
    }).catch(function(error) {
      expect(error.message).to.have.string("Invalid Data");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncCreateTopic] = mediator.subscribe(syncCreateTopic, function(parameters) {
      expect(parameters.itemToCreate).to.deep.equal(mockResultToCreate);

      return Q.reject(expectedError);
    });

    return mediator.publish(createTopic, {
      resultToCreate: mockResultToCreate
    }).catch(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});