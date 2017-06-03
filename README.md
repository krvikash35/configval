[![Build Status](https://travis-ci.org/krvikash35/configValidator.svg?branch=master)](https://travis-ci.org/krvikash35/configValidator)
# configValidator
npm module that will validate given configuration object against given configuration schema. each property will be validated against
its schema defintion, and if any property is invalid as per definition then error message will be aggregated for all such property.
this aggregated error message will be shown on console in proper format.

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

# Configuration Schema Format
schema should be an array of property validation rule and each property validation rule should be an array of attribute.
```
schema format
[ [prop1_def_rule], [prop2_def_rule], [prop3_def_rule].... ]

property definition rule format
[propertiesName<String><Mandatory>, InbuitValidator<String><Mandatory>, PropertyDescription<String><Mandatory>, CustomValidator<Function><optional>]

example
var myConfigSchema = 
[
    ["app.port", "NUMBER", "Open/Available port on which http server will listen/bind", custValAppPort],
    ["db.user", "STRING", "DB user name, set environment variable NODE_DB_USER"],
    ["db.password","STRING", "DB password, set environment variable NODE_DB_PASSWORD"],
    ["db.server", "STRING", "DB hostname/IP, set environment variable NODE_DB_SERVER"],
    ["db.port", "STRING", "DB PORT set environment variable NODE_DB_PORT"],
    ["db.database", "STRING", "DB NAME set environment variable NODE_DB_DATABASE"],
    ["db.connectionTimeout", "NUMBER", "App will tyr to connect to db in this much millisecond time before giving timeout error, if not sure give 15000"],
    ["db.requestTimeout", "NUMBER", "App will tyr to  get db response for request in this much millisecond time before giving timeout error, if not sure give 15000"],
    ["db.pool.max", "NUMBER", "Maximum connection in pool, if not sure give 10"],
    ["db.pool.min", "NUMBER", "Minimum connection in pool, if not sure give 0"],
    ["db.pool.idleTimeoutMillis", "NUMBER", "idle time in millisecond till connection is closed and moved from pool, if not sure give 30000"],
]
```
**Inbuilt Validator**

Inbuilt validator are simple type chekcing validation. As of now, only 3 inbuilt validation is supported.
```
NUMBER  ->   it will check if property value is non-empty number
STRING  ->   it will check if property value is non-empty string
BOOLEAN ->   it will check if property value is of type boolean
```

**Custom validator**

you can attach your own custom validation against any property validation rule. if custom validation is provided, then inbuilt 
validator will not be applied againt that particular property. At time of validation each custom validator function will be called with actual value of its corresponding property. custom validator should check if value is as per their requirement, if not, it must throw 
error with proper message. Below are general format of custom validator function.
```
var custPortValidator = function(configPropValue){
    //write your own logic here as mentioned below
    if( configPropValue > 200 || configPropValue <100){
        throw new Error('value must be between 100 and 200');
    }
}
```

