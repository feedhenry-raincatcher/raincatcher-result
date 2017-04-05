var data = {};

/**
 * Sets sync status for a result object.
 * @param {object} event - object passed in by sync event handler, should contain data used for logItem object.
 */
function addEvent(event) {
  var logItem = {
    entityId: event.uid,
    code: event.code,
    action: event.message.action,
    message: event.message.msg,
    type: event.message.type,
    ts: Date.now()
  };
  data[event.uid] = logItem;
}

/**
 * Updates the current sync status of passed in object.
 * @param {object} result - result object to be updated.
 */
function updateSyncStatus(result) {
  result.syncStatus = data[result.id];
}

/**
 * Iterates through array of passed in objects and updates syncStatus of each object.
 * @param {array} arrayOfResults
 */
function mapResultsToEvents(arrayOfResults) {
  arrayOfResults.forEach(function(result) {
    updateSyncStatus(result);
  });
}


module.exports = {
  addEvent: addEvent,
  updateSyncStatus: updateSyncStatus,
  mapResultsToEvents: mapResultsToEvents
};



