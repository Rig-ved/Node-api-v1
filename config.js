/*
// Create and export configuration variables
 */

var environments  =  {}

environments.staging = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging',
    'hashSecret':'hola'
}


// prod object
environments.production = {
    'httpPort':6000,
    'httpsPort':6001,
    'hashSecret':'hi',
    'envName':'production',
}

// Determine which env was passed as a command line argument 
var currentEnvironment =  typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() :'';

// check the current environment is equal to one of the environments object 
var environmentToExport =  typeof(environments[currentEnvironment]) == "object" ? environments[currentEnvironment] :environments.staging

module.exports = environmentToExport