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
// Define a router 
const router  = {
    'sample' : handlers.sample,
    'ping':handlers.ping
}

module.exports = {
    handlers:handlers,
    router:router
}