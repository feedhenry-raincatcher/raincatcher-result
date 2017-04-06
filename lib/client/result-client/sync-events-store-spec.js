var chai = require('chai');
var expect = chai.expect;
var arrayOfMockResults = require('../../../test/fixtures/mockResults');
var mockSyncEvents = require('../../../test/fixtures/mockSyncEvents');

describe('Sync event store', function() {
  var mockAppliedEvent = mockSyncEvents.mockAppliedEvent;
  var mockFailedEvent = mockSyncEvents.mockFailedEvent;

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
    expect(arrayOfMockResults[0].syncStatus).to.exist;
    expect(arrayOfMockResults[0].syncStatus.entityId).to.equal(mockAppliedEvent.uid);
    expect(arrayOfMockResults[0].syncStatus.code).to.equal(mockAppliedEvent.code);

    expect(arrayOfMockResults[2].syncStatus).to.not.exist;
  });

});


