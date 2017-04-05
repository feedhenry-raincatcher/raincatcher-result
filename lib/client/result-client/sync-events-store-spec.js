var chai = require('chai');
var expect = chai.expect;


describe('Sync event store', function() {
  var arrayOfMockResults = [
    {
      id: "id_01",
      name: "This is a mock Work Order"
    },
    {
      id: "id_02",
      name: "This is a mock Work Order"
    },
    {
      id: "id_03",
      name: "This is a mock Work Order"
    }
  ];
  var mockAppliedEvent =
    {
      code: "remote_update_applied",
      dataset_id: "result",
      message: {
        action: "update",
        cuid: "DCC7E7CCB680440AA14492A7ADBCD52E",
        hash: "1a69ed93636e2fd29a145a96096053176d1581eb",
        msg: "''",
        type: "applied",
        uid: "id_01"
      },
      uid: "id_01"
    };
  var mockFailedEvent = {
    code: "remote_update_failed",
    dataset_id: "result",
    message: {
      action: "update",
      cuid: "DCC7E7CCB680440AA14492A7ADBCD52E",
      hash: "1a69ed93636e2fd29a145a96096053176d1581eb",
      msg: "'Failed for reasons'",
      type: "failed",
      uid: "id_02"
    },
    uid: "id_02"
  };

  var SyncEvents;
  beforeEach(function() {
    SyncEvents = require('./sync-events-store');
    SyncEvents.addEvent(mockAppliedEvent);
    SyncEvents.addEvent(mockFailedEvent);
  });

  it("Should map sync events to results", function() {
    SyncEvents.mapResultsToEvents(arrayOfMockResults);
    expect(arrayOfMockResults[0].syncStatus).to.exist;
    expect(arrayOfMockResults[0].syncStatus.entityId).to.equal(mockAppliedEvent.uid);
    expect(arrayOfMockResults[0].syncStatus.code).to.equal(mockAppliedEvent.code);

    expect(arrayOfMockResults[1].syncStatus).to.exist;
    expect(arrayOfMockResults[1].syncStatus.entityId).to.equal(mockFailedEvent.uid);
    expect(arrayOfMockResults[1].syncStatus.code).to.equal(mockFailedEvent.code);
  });
  it("Should set sync status for result object", function() {
    SyncEvents.updateSyncStatus(arrayOfMockResults[0]);
    expect(arrayOfMockResults[0].syncStatus).to.exist;
    expect(arrayOfMockResults[0].syncStatus.entityId).to.equal(mockAppliedEvent.uid);
    expect(arrayOfMockResults[0].syncStatus.code).to.equal(mockAppliedEvent.code);

    SyncEvents.updateSyncStatus(arrayOfMockResults[2]);
    expect(arrayOfMockResults[2].syncStatus).to.not.exist;
  });

});


