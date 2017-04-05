var SyncEvents = require('../result-client/sync-events-store');

/**
 * Initialsing a subscriber for sync update applied.
 */
module.exports = function syncUpdateAppliedSubscriber() {

  /**
   * Handling the sync events
   *
   * @param {object} parameters
   */
  return function handleListResultsTopic(parameters) {
    console.log('>>>>>', parameters);
    if (parameters && parameters.uid && parameters.message) {
      SyncEvents.addEvent(parameters);
    }
  };
};