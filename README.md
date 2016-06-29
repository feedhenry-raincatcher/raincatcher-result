# FeedHenry RainCatcher Result

A result module for RainCatcher, for working with the results of pushing a workorder through a workflow.

This module provides :
- An AngularJS Service
- An Backend Service to intialize the synchronization


# Client-side usage

### Client-side usage (via broswerify)

#### Setup
This module is packaged in a CommonJS format, exporting the name of the Angular namespace.  The module can be included in an angular.js as follows:

```javascript
angular.module('app', [
, require('fh-wfm-result')
...
])
```

#### Integration

##### Angular service
A sync manager must first be initialized using the `resultSync.managerPromise()`.  This can be placed, for instance, in the `resolve` config of a `ui-router` controlled application.

```javascript
resultManager: function(resultSync) {
  return resultSync.managerPromise;
},
```
For a more complete example, please check the [demo portal app](https://github.com/feedhenry-raincatcher/raincatcher-demo-portal/blob/master/src/app/workorder/workorder.js).


##### `resultSync` API
These resultSync API methods all return Promises:

| resultSync method | Description |
| -------------------- | ----------- |
| `resultSync.manager.list` | list all results |
| `resultSync.manager.create(workflow)` | create a result |
| `resultSync.manager.read(workflowId)` | read a result |
| `resultSync.manager.update(workflow)` | update a result |

### Mediator events
the module broadcasts, and listens for the following events

| Listens for | Responds with |
| ----------- | ------------- |
| `wfm:appform:submission:complete` | `wfm:result:remote-update` |

## Usage in an express backend

### Setup
The server-side component of this RainCatcher module exports a function that takes express and mediator instances as parameters, as in:

```javascript
var express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , mediator = require('fh-wfm-mediator/lib/mediator')
  ;

// configure the express app
...

// setup the wfm workflow sync server
require('fh-wfm-result/lib/server')(mediator, app, mbaasApi);

```

### Integration

Check this [demo cloud application](https://github.com/feedhenry-raincatcher/raincatcher-demo-cloud/blob/master/lib/app/workorder.js)
