var _ = require('lodash');
var name = require('../../package.json').name;
var datasetId = require('../config').datasetId;


/**
 * Function returning debug logger with prebuild signature
 * @param filePath path of the file where logger will be used
 */
module.exports = function setupLogger(filePath) {
  var str = filePath.substring(filePath.indexOf(datasetId)).replace(datasetId, name);

  return require('debug')(_.trim(str.split('/').join(':'), '.js') + ':');
};
