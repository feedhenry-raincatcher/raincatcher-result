var SyncEvents = require('../result-client/sync-events-store');

/**
 * Initialsing a subscriber for sync events.
 */
module.exports = function syncEventSubscriber() {

  /**
   * Handling the sync events
   *
   * @param {object} parameters
   * @param {String} parameters.uid - uid of related result object
   * @param {object} parameters.message - sync event message
   * https://access.redhat.com/documentation/en-us/red_hat_mobile_application_platform_hosted/3/html/client_api/fh-sync#sync-example-1
   */
  return function handleSyncEventTopics(parameters) {
    if (parameters && parameters.uid && parameters.message) {
      SyncEvents.addEvent(parameters);
    }
  };
};


