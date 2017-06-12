
/**
 * Initialsing a subscriber for Listing results.
 *
 * @param {object} resultEntityTopics
 * @param {ManagerWrapper} resultClient
 */
module.exports = function listResultSubscriber(resultEntityTopics, resultClient) {

  /**
   *
   * Handling the listing of results
   *
   * @returns {*}
   */
  return function handleListResultsTopic() {
    return resultClient.manager.list();
  };
};