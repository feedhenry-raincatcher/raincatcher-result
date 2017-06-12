var _ = require('lodash');
var Q = require('q');


/**
 * Initialising a subscriber for creating a result.
 *
 * @param {object} resultEntityTopics
 * @param {ManagerWrapper} resultClient
 */
module.exports = function createResultSubscriber(resultEntityTopics, resultClient) {

  /**
   *
   * Handling the creation of a result
   *
   * @param {object} parameters
   * @param {object} parameters.resultToCreate   - The result item to create
   * @returns {*}
   */
  return function handleCreateResultTopic(parameters) {
    parameters = parameters || {};

    var resultToCreate = parameters.resultToCreate;

    //If no result is passed, can't create one
    if (!_.isPlainObject(resultToCreate)) {
      return Q.reject(new Error("Invalid Data To Create A Result."));
    }

    return resultClient.manager.create(resultToCreate);
  };
};