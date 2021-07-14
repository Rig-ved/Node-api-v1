const http = require("http");

let config =  require('./config')
const https =  require('https')
let fs = require('fs')
let unifiedServer =  require('./unifiedServer')




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





