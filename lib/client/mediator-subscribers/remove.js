var Q = require('q');

/**
 * Initialsing a subscriber for removing results.
 *
 * @param {object} resultEntityTopics
 * @param {ManagerWrapper} resultClient
 */
module.exports = function removeResultSubscriber(resultEntityTopics, resultClient) {


  /**
   *
   * Handling the removal of a single result
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the result to remove.
   * @returns {*}
   */
  return function handleRemoveResult(parameters) {
    parameters = parameters || {};

    //If there is no ID, then we can't read the result.
    if (!parameters.id) {
      return Q.reject(new Error("Expected An ID When Removing A Result"));
    }

    return resultClient.manager.delete({
      id: parameters.id
    });
  };
};