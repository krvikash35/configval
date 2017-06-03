function validateConfigSchema(cs){
    let inBuiltTypes = ['NUMBER', 'STRING', 'BOOLEAN'];
    if( !Array.isArray(cs) ){
        throw new Error(`given configSchema should be of type array but it is of type ${typeof cs}`)
    }
    console.log("length", cs.length)
    for( let i=0; i<cs.length; i++ ){
        if( !Array.isArray( cs[i] ) ){
            throw new Error(`property no ${i} in given configSchema should be of type array but it is of type ${typeof cs[i]}`)
        }
        if( cs[i].length < 3 ){
            throw new Error(`property no ${i} in given configSchema should have minimum length 3 but its length is ${cs[i].length}`);
        }
        
        let actualType = `${typeof cs[i][0]} ${typeof cs[i][1]} ${typeof cs[i][2]}`
        let expectedType = `string string string`
        if( cs[i].length === 3 && actualType != expectedType){
            throw new Error(`property no ${i} in given configSchema should be of format type {${expectedType}} but it is of format type {${actualType}}`)
        }
        if( cs[i].length === 4 && typeof cs[i][3] != 'function' ){
            throw new Error(`property no ${i} in given configSchema should be of format type {${expectedType} function} but it is of format type {${actualType} ${typeof cs[i][3]}}`)
        }
        if( inBuiltTypes.indexOf( cs[i][1] ) == -1 ){
            throw new Error(`property no ${i} in given configSchema should have type from one of ${inBuiltTypes} but it is ${cs[i][1]}`)
        }
    }
}


function validateConfig(config, currProName, currProType, currProDesc, currProCustVal){
    let actualValue = config;
    let prop = '';
    currProName = currProName.split('.');

    for( let i=0; i<currProName.length; i++ ){
        prop = prop + currProName[i] + ".";
        if(  i!=currProName.length-1 && actualValue[ currProName[ i ] ] == undefined ){
                prop = prop.slice(0, -1)
                throw new Error(`${prop} is not defined/attached to config object\n\n`);
        }else{
            actualValue = actualValue[ currProName[ i ] ];
        }
    }

    prop = prop.slice(0, -1)
    currProCustVal? currProType='CUSTOM': '';
    console.log("actual value", actualValue)
    switch( currProType ){
        case 'NUMBER':
            if( !(typeof actualValue === 'number' && actualValue.toString().length > 0) ){
                throw new Error(`properties:    ${prop}\nDescription:   ${currProDesc} \nExpected Value:   should be non-empty number \nActual Value:    ${actualValue}\n\n`);
            }
            break;
        case 'STRING':
            if( !(typeof actualValue === 'string' && actualValue.length > 0) ){
                throw new Error(`properties:    ${prop}\nDescription:   ${currProDesc} \nExpected Value:   should be non-empty string \nActual Value:    ${actualValue}\n\n`);
            }
            break;
        case 'BOOLEAN':
            if( !( typeof actualValue === 'boolean' ) ){
                throw new Error(`properties:    ${prop}\nDescription:   ${currProDesc} \nExpected Value:   should be boolean type \nActual Value:    ${actualValue}\n\n`);
            }
            break;
        case 'CUSTOM':
            try{
                currProCustVal(actualValue)
            }catch(e){
                throw new Error(`properties:    ${prop}\nDescription:   ${currProDesc} \nExpected Value:   ${e.message}\nActual Value:    ${actualValue}\n\n`);   
            }
            
    }
}

class ConfigValidator {
    constructor(){

    }
    validateWithSchema(config, config_schema){
        validateConfigSchema(config_schema);
        let schProLen = config_schema.length;
        let errStack = '';
        let currProName;
        let currProType;
        let currProDesc;
        let currProCustVal;
        for(var i=0; i<schProLen; i++){
            currProName     = config_schema[i][0];
            currProType     = config_schema[i][1];
            currProDesc     = config_schema[i][2];
            currProCustVal  = config_schema[i][3];
            try{
                validateConfig(config, currProName, currProType, currProDesc, currProCustVal)
            }catch(e){
                errStack = errStack + e.message;
            }
        }
        if( errStack ){
            throw new Error(`configuration is not as per schema..below are validation error\n\n${errStack}`)
        }
        
    }

}

module.exports = new ConfigValidator();