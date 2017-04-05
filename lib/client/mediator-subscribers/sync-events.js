var SyncEvents = require('../result-client/sync-events-store');

/**
 * Initialsing a subscriber for sync events.
 */
module.exports = function syncEventSubscriber() {

  /**
   * Handling the sync events
   *
   * @param {object} parameters
   */
  return function handleSyncEventTopics(parameters) {
    if (parameters && parameters.uid && parameters.message) {
      SyncEvents.addEvent(parameters);
    }
  };
};
