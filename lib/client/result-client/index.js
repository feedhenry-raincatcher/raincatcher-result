var q = require('q');
var _ = require('lodash');
var CONSTANTS = require('../../constants');
var config = require('../../config');
var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');
var mediator, manager, resultSyncSubscribers;



/**
 *
 * Creating a new result.
 *
 * @param {object} resultToCreate - The Result to create.
 */
function create(resultToCreate) {

  var topicParams = {itemToCreate: resultToCreate};

  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.CREATE), topicParams);
}

/**
 *
 * Updating an existing result.
 *
 * @param {object} resultToUpdate - The result to update
 * @param {string} resultToUpdate.id - The ID of the result to update
 */
function update(resultToUpdate) {
  var topicParams = {itemToUpdate: resultToUpdate};

  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.UPDATE), topicParams);
}

/***
 *
 * Reading a single result.
 *
 * @param {string} resultId - The ID of the result to read
 */
function read(resultId) {
  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.READ), {id: resultId});
}

/**
 * Listing All Results
 */
function list() {
  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.LIST));
}

/**
 *
 * Removing a workororder using the sync topics
 *
 * @param {object} resultToRemove
 * @param {string} resultToRemove.id - The ID of the workoroder to remove
 */
function remove(resultToRemove) {
  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.REMOVE),  {id: resultToRemove.id});
}

/**
 * Starting the synchronisation process for results.
 */
function start() {
  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.START));
}

/**
 * Stopping the synchronisation process for results.
 */
function stop() {
  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.STOP));
}

/**
 * Forcing the results to sync to the remote store.
 */
function forceSync() {
  return mediator.publish(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.FORCE_SYNC));
}

/**
 * Safe stop forces a synchronisation to the remote server and then stops the synchronisation process.
 * @returns {Promise}
 */
function safeStop() {
  return forceSync().then(stop);
}


/**
 * Waiting for the synchronisation process to complete to the remote cluster.
 */
function waitForSync() {
  return mediator.promise(resultSyncSubscribers.getTopic(CONSTANTS.TOPICS.SYNC_COMPLETE));
}

function ManagerWrapper(_manager) {
  this.manager = _manager;
  var self = this;

  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'start', 'stop', 'safeStop', 'forceSync', 'waitForSync'];
  methodNames.forEach(function(methodName) {
    self[methodName] = function() {
      return q.when(self.manager[methodName].apply(self.manager, arguments));
    };
  });
}


/**
 *
 * Initialising the result-client with a mediator.
 *
 * @param _mediator
 * @returns {ManagerWrapper|*}
 */
module.exports = function(_mediator) {

  //If there is already a manager, use this
  if (manager) {
    return manager;
  }

  mediator = _mediator;

  resultSyncSubscribers = new MediatorTopicUtility(mediator);
  resultSyncSubscribers.prefix(CONSTANTS.SYNC_TOPIC_PREFIX).entity(config.datasetId);

  manager = new ManagerWrapper({
    create: create,
    update: update,
    list: list,
    delete: remove,
    start: start,
    stop: stop,
    read: read,
    safeStop: safeStop,
    forceSync: forceSync,
    publishRecordDeltaReceived: _.noop,
    waitForSync: waitForSync,
    datasetId: config.datasetId
  });

  return manager;
};