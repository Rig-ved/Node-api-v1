// Library for storing and reading our data from 

let fs = require('fs')
let path  = require('path')

// container for the lib to store the module data 
let lib = {}

// base dir for the file 
lib.baseDir =  path.join(__dirname,'/../.data/')

lib.create = function(dir,file,dataRec,callback){
    // open the file for writing 
     fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDesc){
        if(!err && fileDesc) {
            // convert data to a string
            let stringData   = JSON.stringify(dataRec)
            fs.writeFile(fileDesc,stringData,function(err){
                if(!err) {
                    fs.close(fileDesc,function(){
                        if(!err) {
                            callback(false)
                        } else {
                            callback('Error in closing the file')
                        }
                    })
                } else {
                    callback('Error in writing data to file')
                }
            })
        } else {
            callback('Unable to create new file , it already exists')
        }

     })

}

// read Data from a file 

lib.read =  function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
        callback(err,data)
    })
}

// delete the file 
lib.delete =  function(dir,file,callback) {
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false)
        } else {
            callback(err.message)
        }
    })
}


// update the new file 
lib.update =  function(dir,file,dataRec,callback) {
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDes) {
        if(!err && fileDes) {
            var data  =  JSON.stringify(dataRec)

            // Truncate the file as we dont want to remove the already existing things there 
            fs.ftruncate(fileDes,function(err){
                if(!err) {
                    fs.writeFile(fileDes,data,function(err){
                        if(!err) {
                            fs.close(fileDes,function(err) {
                                if(!err) {
                                    callback(false)
                                } else {
                                    callback('Error closing the existing file')
                                }
                            })
                        } else {
                            callback('Error Writing to the file')
                        }
                    })
                } else {
                    callback('Error truncating the file')
                }
               
            })
        } else {
            callback('couldnot open the file for updating')
        }
    })
}


// export the module 
module.exports =  lib
