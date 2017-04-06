module.exports = {
  mockAppliedEvent: {
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
  },
  mockFailedEvent: {
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
  }
};
