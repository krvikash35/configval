var tap = require('tap');
var cv = require('../index');

tap.test('VALID SCEMA AND VALID CONFIGURATION: when config object is as per schema', function(t){
    let cs = [ ['app.port', 'NUMBER', 'app port on which it bind/listen']];
    let c = {app: { port: 5000 }, db:{ } }
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        t.notOk(e, 'should not throw any error')
    }
    t.end()  
})

tap.test('INVALID SCHEMA: when schema is non-array', function(t){
    let cs = {};
    let c = {app: { port: 3000 }, db:{ pool: { min: 2, max:10 } } }
    let expect = 'given configSchema should be of type array but it is of type object';
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, "error message should be expected one");
    t.end()
})


tap.test('INVALID SCHEMA: when one of properties definition in non-array', function(t){
    let cs = [ ['app.port', 'NUMBER', 'app port on which it bind/listen'], {} ];
    let c = {app: { port: 3000 }, db:{ pool: { min: 2, max:10 } } }
    let expect = 'property no 1 in given configSchema should be of type array but it is of type object';
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw error message that schema should be of type array');
    t.end()
})


tap.test('INVALID SCHEMA: when one of properties definition in non-array', function(t){
    let cs = [ ['app.port', 'NUMBER', 'app port on which it bind/listen'], {} ];
    let c = {app: { port: 3000 }, db:{ pool: { min: 2, max:10 } } }
    let expect = 'property no 1 in given configSchema should be of type array but it is of type object';
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw errro message that schema properties definition should of type array');
    t.end()
})



tap.test('INVALID SCHEMA: when one of properties definition is array but length less than 3', function(t){
    let cs = [ ['app.port', 'NUMBER'] ];
    let c = {app: { port: 3000 }, db:{ pool: { min: 2, max:10 } } }
    let expect = 'property no 0 in given configSchema should have minimum length 3 but its length is 2';
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw errro message that schema properties definiton should have at least 3 attribute');
    t.end()
})



tap.test('INVALID SCHEMA: when one of properties definition array length is 3 but is not of expected format', function(t){
    let cs = [ ['app.port', 'NUMBER', 2000] ];
    let c = {app: { port: 3000 }, db:{ pool: { min: 2, max:10 } } }
    let expect = 'property no 0 in given configSchema should be of format type {string string string} but it is of format type {string string number}';
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})


tap.test('INVALID SCHEMA: when one of properties definition array length is 4 but is not of expected format', function(t){
    let cs = [ ['app.port', 'NUMBER', 'app port on which it bind/listen', 200] ];
    let c = {app: { port: 3000 }, db:{ pool: { min: 2, max:10 } } }
    let expect = 'property no 0 in given configSchema should be of format type {string string string function} but it is of format type {string string string number}';
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})


tap.test('INVALID SCHEMA: when one of properties definition contain unsupported/invalid inbuilt validator', function(t){
    let cs = [ ['app.port', 'NUMBER1', 'app port on which it bind/listen'] ];
    let c = {app: { port: 3000 }, db:{ pool: { min: 2, max:10 } } }
    let expect = 'property no 0 in given configSchema should have type from one of NUMBER,STRING,BOOLEAN but it is NUMBER1';
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})



tap.test('INVALID CONFIG: when one of parent object is not defined in config object as per schema', function(t){
    let cs = [ ['app.port', 'NUMBER', 'app port on which it bind/listen'], ['db.pool.min', 'NUMBER', 'minimum pool connection'] ];
    let c = {app: { port: 3000 }, db:{ } }
    let expect = `configuration is not as per schema..below are validation error\n\ndb.pool is not defined/attached to config object\n\n`
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})

tap.test('INVALID CONFIG: one of config property is non-number but should be number as per spec', function(t){
    let cs = [ ['app.port', 'NUMBER', 'app port on which it bind/listen']];
    let c = {app: { port: '3000' }, db:{ } }
    let expect = `configuration is not as per schema..below are validation error\n\nproperties:    app.port\nDescription:   app port on which it bind/listen \nExpected Value:   should be non-empty number \nActual Value:    3000\n\n`
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})


tap.test('INVALID CONFIG: one of config property is non-string but should be string as per spec', function(t){
    let cs = [ ['app.port', 'STRING', 'app port on which it bind/listen']];
    let c = {app: { port: 3000 }, db:{ } }
    let expect = `configuration is not as per schema..below are validation error\n\nproperties:    app.port\nDescription:   app port on which it bind/listen \nExpected Value:   should be non-empty string \nActual Value:    3000\n\n`
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})


tap.test('INVALID CONFIG: one of config property is non-boolean but should be boolean as per spec', function(t){
    let cs = [ ['app.port', 'BOOLEAN', 'app port on which it bind/listen']];
    let c = {app: { port: 3000 }, db:{ } }
    let expect = `configuration is not as per schema..below are validation error\n\nproperties:    app.port\nDescription:   app port on which it bind/listen \nExpected Value:   should be boolean type \nActual Value:    3000\n\n`
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})


tap.test('INVALID CONFIG: one of config property is using custom validator', function(t){
    let customVal = function(value){
        if( value>3000 || value<2000){
            throw new Error('value should be between 2000 and 3000')
        }
    }
    let cs = [ ['app.port', 'BOOLEAN', 'app port on which it bind/listen', customVal]];
    let c = {app: { port: 5000 }, db:{ } }
    let expect = `configuration is not as per schema..below are validation error\n\nproperties:    app.port\nDescription:   app port on which it bind/listen \nExpected Value:   value should be between 2000 and 3000\nActual Value:    5000\n\n`
    let actual;
    try{
        cv.validateWithSchema(c, cs)
    }catch(e){
        actual = e.message;
    }
    t.equal( actual, expect, 'should throw proper error message ');
    t.end()
})