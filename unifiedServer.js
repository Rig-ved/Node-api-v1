// Create unified server request handler
const { URL } = require("url");
const { StringDecoder } = require("string_decoder");
let routerConfig =  require('./router')

function unifiedServer(req,res) {
    if (req.url != "/favicon.ico") {
      // parse the request
      const fullurl = "http://" + req.headers.host + req.url;
      const urlObj = new URL(fullurl);
  
      //get the query String params
      /**
       * @Get a single query String
       * @Get a query String Object as well
       * */
      let queryString = urlObj.searchParams.get("foo");
      let queryStringObj = Object.fromEntries(urlObj.searchParams.entries());
  
      // get the path from the url
      let path = urlObj.pathname;
      let trimmedPath = path.replace(/^\/+|\/+$/g, "");
  
      //get the http method
      const method = req.method.toUpperCase();
  
      // get the headers
      const headers = req.headers;
  
      // What decoders you need for an incoming stream 
      const decoder = new StringDecoder("utf-8");
      let buffer = "";
      // Get the payload if any
      // whenever incoming stream has  a payload 
      req.on("data", (data) => {
        // decoder.write will append the data to the buffer as it comes along   
        buffer += decoder.write(data);
      });
      // The end event will be called everytime even though we dont have a payload 
      req.on("end", () => {
        buffer += decoder.end();
        // chose the handler this request should go to 
        let chosenHandler =   typeof (routerConfig.router[trimmedPath]) !== 'undefined' ? routerConfig.router[trimmedPath] : routerConfig.handlers.notFound
        
        // construct the data object to be sent to the handler 
        let data  = {
            "trimmedPath":trimmedPath,
            "headers":headers,
            "method":method,
            "payload":buffer,
            "queryString":queryStringObj
        }
  
        // Route the request to the handler 
        chosenHandler(data,function(statusCode,payload){
            // check the status 
            statusCode =  typeof statusCode === 'number' ? statusCode:200
            // check the payload
            payload = typeof payload === 'object' ? payload:{}
  
            // convert the payload to string 
            payload = JSON.stringify(payload)
  
            // set the content type as json
            res.setHeader('Content-Type','application/json')
  
            // send the payload as response
            res.writeHead(statusCode)
              // send the response
            res.end(payload);
            console.log('Returning the response' , statusCode , payload)
        })
  
      });
    }
}

module.exports = unifiedServer