// Dependencies on this file 
const lib = require('./lib/lib')
var libData =  require('./lib/lib')
var helpers = require('./lib/helpers')

// Define a handler 
var handlers =  {}

//Sample Handlers
handlers.sample =  function(data,callback) {
        // callback a https status code and a handler for the same 
        let responsePayload = {
            'data':'new Value',
            'user':'Rigved'
        }
        callback(200,responsePayload)
}
// handler for not found as its not found the router configuration need not declare this 
handlers.notFound =  function(data,callback) {
        callback(404)
} 

handlers.ping =  function(data,callback) {
    callback(200,{'message':'Server is running'})
}
handlers.users  = function(data,callback) {
    var acceptableMethods  = ['POST','PUT','GET','DELETE']
    if(acceptableMethods.indexOf(data.method) != -1 ) {
        handlers._users[data.method.toLowerCase()](data,callback)  
    } else {
        callback(405)
    }

}
// container for the users methods 
handlers._users = {}

// Users- post
handlers._users.post =  function(data,callback) {
    // check params coming from the request 
    var firstName =  typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim():false 
    var lastName =  typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim():false 
    var phone =  typeof data.payload.phone === 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim():false 
    var password =  typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false 
    var agreement =  typeof data.payload.agreement === 'boolean' && data.payload.agreement == true ? true :false 

    if(firstName && lastName && phone && password && agreement) {
        // make sure the users doesnt already exist 
        libData.read('users',phone,function(err,data){
            if(err) {
                // Hash the password 
                var hashPassword  = helpers.hash(password)

                // create the user Object 
                if(hashPassword) {
                    let userObj  = {
                        'firstName':firstName,
                        'lastName':lastName,
                        'phone':phone,
                        'password':hashPassword,
                        'agreement':agreement
                    }
    
                    // Store the user Object
                    lib.create('users',phone,userObj,function(err){
                        if(!err) {
                            callback(200)
                        } else {
                            callback(500,{'message':'Could not create the new user'})
                        }
                    })
                } else {
                    callback(500,{'message':'Could not hash the new password'})
                }
               
            } else {
                callback(400,{'message':'User already exists'})
            }
        })
    } else {
        callback(400,{'messsage':'Missing Required fields'})
    }
}

//users - get

handlers._users.get =  function(data,callback) {
    // check that the phone number is valid
    let phone  =  typeof data.queryString.phone =="string" && data.queryString.phone.trim().length  == 10 ? data.queryString.phone:false
    if(phone) {
        libData.read('users',phone,function(err,data){
            if(!err && data) {
                delete data.password
                callback(200,data)
            } else {
                callback(404,{"message":"Unable to read the data"})
            }
        })

    } else {
        callback(400,{"message":"Missing required fields"})
    }
}

// users put
handlers._users.put =  function(data,callback) {}

// users-DELETE
handlers._users.delete =  function(data,callback) {

}

module.exports = {
    handlers:handlers,
    
}