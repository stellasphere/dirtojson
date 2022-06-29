const fs = require("fs").promises

async function dirtojson(directory,options) {
  var options = options || {}
  var defaultoptions = {
    debug: false
  }
  options = Object.assign(defaultoptions,options)

  if(options.debug) console.log("MAPPING DIRECTORY:", directory)
  if(options.debug) console.time("directory")
  
  var directoryfiles = await fs.readdir(directory)
  
  if(options.debug) console.log("Files in Directory",directoryfiles)
  var directoryjson = {
    directory: directory,
    files: {},
    folders: {},
    allfiles: [],
    type: "folder"
  }
  
  for(var item of directoryfiles) {
    var itempath = `${directory}/${item}`
    var iteminfo = await fs.lstat(itempath)
    var itemfile = iteminfo.isFile()
    var itemdir = iteminfo.isDirectory()

    if(itemfile) {
      var filejson = {
        directory: itempath,
        filename: item,
        parentpath: directory,
        isfile: itemfile,
        isfolder: itemdir,
        type: "file"
      }
      directoryjson.files[item] = filejson
      directoryjson.allfiles.push(filejson)
    }

    if(itemdir) {
      var dirjson = await dirtojson(itempath,options)
      directoryjson.folders[item] = dirjson
      directoryjson.allfiles.push(dirjson)
    }
  }

  if(options.debug) console.timeEnd("directory")
  
  return directoryjson
}

module.exports = dirtojson;

