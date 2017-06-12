var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var CONSTANTS = require('../../lib/constants');
var ResultClient = require('../../lib/client/result-client');
var expect = chai.expect;
var Q = require('q');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');


describe("Result Update Mediator Topic", function() {

  var mockResultToUpdate = {
    id: "resultidtoupdate",
    name: "This is a mock Work Order"
  };

  var expectedUpdatedResult =  _.defaults({name: "Updated Result"}, mockResultToUpdate);

  var updateTopic = "wfm:results:update";

  var syncUpdateTopic = "wfm:sync:result:update";

  var resultClient = ResultClient(mediator);

  var resultSubscribers = new MediatorTopicUtility(mediator);
  resultSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULT_ENTITY_NAME);

  beforeEach(function() {
    this.subscribers = {};
    resultSubscribers.on(CONSTANTS.TOPICS.UPDATE, require('../../lib/client/mediator-subscribers/update')(resultSubscribers, resultClient));
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    resultSubscribers.unsubscribeAll();
  });

  it('should use the sync topics to update a result', function() {
    this.subscribers[syncUpdateTopic] = mediator.subscribe(syncUpdateTopic, function(parameters) {
      expect(parameters.itemToUpdate).to.deep.equal(mockResultToUpdate);

      return Q.resolve(expectedUpdatedResult);
    });

    return mediator.publish(updateTopic, {
      resultToUpdate: mockResultToUpdate
    }).then(function(updatedResult) {
      expect(updatedResult).to.deep.equal(expectedUpdatedResult);
    });
  });

  it('should publish an error if there is no object to update', function() {
    return mediator.publish(updateTopic, {
    }).catch(function(error) {
      expect(error.message).to.have.string("Invalid Data");
    });
  });

  it('should publish an error if there is no result id', function() {
    return mediator.publish(updateTopic, {
      resultToUpdate: "notaresult"
    }).catch(function(error) {
      expect(error.message).to.have.string("Invalid Data");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");

    this.subscribers[syncUpdateTopic] = mediator.subscribe(syncUpdateTopic, function(parameters) {
      expect(parameters.itemToUpdate).to.deep.equal(mockResultToUpdate);

      return Q.reject(expectedError);
    });

    return mediator.publish(updateTopic, {
      resultToUpdate: mockResultToUpdate
    }).catch(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});