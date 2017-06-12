var Q = require('q');

/**
 * Initialsing a subscriber for reading results.
 *
 * @param {object} resultEntityTopics
 * @param {ManagerWrapper} resultClient
 */
module.exports = function readResultSubscriber(resultEntityTopics, resultClient) {


  /**
   *
   * Handling the reading of a single result
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the result to read.
   * @returns {*}
   */
  return function handleReadResultsTopic(parameters) {
    parameters = parameters || {};

    //If there is no ID, then we can't read the result.
    if (!parameters.id) {
      return Q.reject( new Error("Expected An ID When Reading A Result"));
    }

    return resultClient.manager.read(parameters.id);
  };

};