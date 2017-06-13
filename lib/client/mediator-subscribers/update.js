var _ = require('lodash');
var Q = require('q');


/**
 * Initialsing a subscriber for updating a result.
 *
 * @param {object} resultEntityTopics
 * @param {ManagerWrapper} resultClient
 */
module.exports = function updateResultSubscriber(resultEntityTopics, resultClient) {

  /**
   *
   * Handling the update of a result
   *
   * @param {object} parameters
   * @param {object} parameters.resultToUpdate   - The result item to update
   * @returns {*}
   */
  return function handleUpdateTopic(parameters) {
    parameters = parameters || {};
    var resultToUpdate = parameters.resultToUpdate;

    //If no result is passed, can't update one. Also require the ID of the workorde to update it.
    if (!_.isPlainObject(resultToUpdate)) {
      return Q.reject(new Error("Invalid Data To Update A Result."));
    }

    return resultClient.manager.update(resultToUpdate);
  };
};
