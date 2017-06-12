# FeedHenry WFM Result [![Coverage Status](https://coveralls.io/repos/github/feedhenry-raincatcher/raincatcher-result/badge.svg?branch=master)](https://coveralls.io/github/feedhenry-raincatcher/raincatcher-result?branch=master)

A result module for WFM, for working with the results of pushing a workorder through a workflow.

## Client-side usage

### Setup
This module can be initialised by 

```javascript
var resultModule = require('fh-wfm-result');

//Initialising the result module with a mediator. This will set up all of the subscribers for the result module.
resultModule(mediator);

//The result mediator topics are now subscribed.
mediator.publish("wfm:results:list").then(function(arrayOfResults) {
  ...
  console.log("All Results", arrayOfResults);
  ...
});
```

#### Integration

### Topic Subscriptions

| Topic | Parameters |
| ----------- | ------------- |
| wfm:results:list |  ```NONE```  |
| wfm:results:read | ```{id: <<id of result to read>>}``` |
| wfm:results:update | ```{resultToUpdate: {<<A valid result>>}}``` |
| wfm:results:create | ```{resultToCreate: {<<A valid result>>}}``` |
| wfm:results:remove | ```{id: <<id of result to remove>>}``` |

### Published Topics

The following topics are published by this module. Developers are free to implement these topics subscribers, or use a module that already has these subscribers implement (E.g. the [raincatcher-sync](https://github.com/feedhenry-raincatcher/raincatcher-sync) module).


| Topic         | Parameters           |
| ------------- |:-------------:| 
| wfm:sync:results:create              |  ```{itemToCreate: resultToCreate}```  |
| wfm:sync:results:update              |  ```{itemToUpdate: resultToUpdate}```  |
| wfm:sync:results:list              |  ```NONE```  |
| wfm:sync:results:remove              |  ```{id: <<ID Of Workorder To Remove>>}```  |
| wfm:sync:results:read              |  ```{id: <<ID Of Workorder To Read>>}```  |

## Usage in an express backend

### Setup
The server-side component of this WFM module exports a function that takes express and mediator instances as parameters, as in:

```javascript
var express = require('express')
  , app = express()
  , mbaasExpress = mbaasApi.mbaasExpress()
  , mediator = require('fh-wfm-mediator/lib/mediator')
  ;

// configure the express app
...

// setup the wfm result sync server
require('fh-wfm-result/lib/cloud')(mediator, app, mbaasApi);

```

