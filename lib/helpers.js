// Define the helpers file 


// Define the dependencies
var crypto = require('crypto')
var config =  require('../config')
var helpers  =  {}

helpers.hash = function(str) {
    var hash = ""
    if(typeof str == 'string' && str.trim().length > 0) {
         hash = crypto.createHmac('sha256',config.hashSecret).update(str).digest('hex')
         return hash
    } else {
        throw Error ("Error hashing the password")
    }
    
}

helpers.parseToJson =  function(str) {
    try {
        var obj = JSON.parse(str)
        return obj
    }catch(e){
        return {}
    }
}

module.exports = helpers