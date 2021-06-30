const http = require("http");

let config =  require('./config')
const https =  require('https')
let fs = require('fs')
let unifiedServer =  require('./unifiedServer')

let data  = require('./lib/lib')
// Test 
data.create('test','users',{'hello':'world'},function(err){
  console.log(err)
})
// data.delete('test','nest',function(err){
//   console.log(`Error in deleting the file , ${err}`)
// })

// // data.read('test','nest',function(err,data){
// //   console.log(`Error is ${err} and data is ${data}`)
// // })


// Create the http server object
const httpServer = http.createServer((req, res) => {
   unifiedServer(req,res)
});

// listen on http port
httpServer.listen(config.httpPort, () => {
  console.log(`Server is listening on ${config.httpPort} in ${config.envName}`);
});

// Create the https server object
var httpsServerOptions = {
    'key':fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions,(req, res) => {
  unifiedServer(req,res)
});

// listen on https port
httpsServer.listen(config.httpsPort, () => {
 console.log(`Server is listening on ${config.httpsPort} in ${config.envName}`);
});





