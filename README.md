[![Build Status](https://travis-ci.org/krvikash35/configValidator.svg?branch=master)](https://travis-ci.org/krvikash35/configValidator)
# configValidator
npm module that will validate given configuration object against given configuration schema.

**Installation**
```
npm install config-validator
```

**Basic Usage**
```
const config        = require('./config/config');
const configSchema  = require('./config/configSchema');
const cv            = require('config-validator');

try{
    cv.validateWithSchema( config, configSchema );
}catch(e){
    console.log(e.message);
    process.exit(1);
}
```

**Api**
```
validateWithSchema(config, configSchema)
argument: 
    config<object>:         configuration object
    configSchema<object>:   configuration schema object, should be in proper format
output:
    throw error with proper message, if configuration schema is not as per accepted format.
    throw error with proper message, if configuraiton object is not as per configuration schema.
```





