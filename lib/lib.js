// require the file system 
let fs  =  require('fs'); 
// require the path module 
let path = require('path')

let helpers = require('./helpers')

// container for this module
let lib  = {}

// set the base directory in the lib object 
lib.baseDir = path.join(__dirname,'../.data/')


lib.create = function(dir,file,data,callback) {
    fs.open( lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor) {
            // if data is there we have to convert to a string 
            if(data) {
                var stringData =  JSON.stringify(data)
                fs.writeFile(fileDescriptor,stringData,function(err){
                    if(!err) {
                       fs.close(fileDescriptor,function(err){
                           if(!err) {
                                callback(false)
                           }else {
                               callback("Error closing the file")
                           }
                       })
                    } else {
                        callback('Unable to write to the file ')
                    }
                })
            }
            
        } else {
            callback("Unable to open the file as it may already exist")
        }
    })
}


lib.read =  function(dir,file,callback){
    fs.readFile( lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
        if(err) {
            callback(err,data)
        } else {
            var parsedData  =  helpers.parseToJson(data)
            callback(false,parsedData)
        }
       
    })
}


// update the file 
lib.update =  function(dir,file,data,callback) {
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err && fileDescriptor) {
            // if data exist add it to the file 
            if(data) {
                // connvert into string data
                var stringData =  JSON.stringify(data)
                // truncate the contents of the file
                fs.ftruncate(fileDescriptor,function(err){
                    if(!err) {
                        fs.writeFile(fileDescriptor,stringData,function(err){
                            if(!err){
                                fs.close(fileDescriptor,function(err){
                                    if(!err) {
                                        callback(false)
                                    } else { 
                                        callback("Error closing the file")
                                    }
                                })
                            } else {
                                callback('Error writing to the file while updating')
                            }
                        }) 
                    } else {
                        callback('Error passing to the file Descriptor')
                    }
                })
            }
        } else {
            callback('Couldnot open the file')
        }
    })
}
// deleting the file 
lib.delete =  function(dir,file,callback){
    fs.unlink(lib.baseDir+dir+"/"+file+'.json',function(err){
        if(err) {
            throw Error("Error in deleting the file")
        }
        callback(false)
    })
}
// export the container 
module.exports = lib


/**
 * let data  = require('./lib/lib')
Test 
data.create('test','users',{'hello':'world'},function(err){
  console.log(err)
})

data.update('test','users',{'zsas':'assa'},function(err){
  console.log(err)
})
data.delete('test','users',function(data){
  console.log(`${err}`)
})

data.read('test','users1',function(data){
  console.log(`Output is ${data}`)
})
*/
