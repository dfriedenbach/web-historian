var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var urlList = [];
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8',function(error, content) {
    if(!error) {
      urlList = content.split('\n');
      if (callback) {
        callback(urlList);
      }
    }
  });
};

exports.isUrlInList = function(url){
  var found = false
  exports.readListOfUrls(function() {
    for(var i = 0; i < urlList.length; i++) {
      console.log('Checking: "' + url + '" vs. "' + urlList[i] + '"');
      if(urlList[i] === url) {
        found = true;
      }
    }
  });
  return found;
};

exports.addUrlToList = function(){
};

exports.isUrlArchived = function(url){
  var found = false;
  fs.open(exports.paths.archivedSites + '/' + url, 'r', function(error) {
    if(!error) {
      found = true;
    }
  });

  if(found) {
    fs.close(exports.paths.archivedSites + '/' + url, function(){

    });
  }
  return found;
};

exports.downloadUrls = function(){
};
