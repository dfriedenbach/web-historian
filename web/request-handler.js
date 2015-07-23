var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var qs = require('querystring');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    if(req.url === '/') {
      httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function(error, content) {
        if(error) {
          res.writeHead(500);
          res.end();
        } else {
          res.writeHead(200, headers);
          res.end(content);
        }
      });
    } else {
      var filePath = archive.paths.archivedSites + req.url;
      fs.readFile(filePath, function(error, content) {
        if(error) {
          res.writeHead(404);
          res.end('404: File not found.');
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(content);
        }
      });
    }
  },

  'POST': function(req, res) {
    var tempData = '';
    req.on('data', function(data) {
      tempData += data;
    });
    req.on('end', function() {
      var filePath = archive.paths.archivedSites + req.url;
      var post = qs.parse(tempData);
      if (archive.isUrlInList(post.url)) {
        if(archive.isUrlArchived(post.url)) {
          fs.readFile(filePath, function(error, content) {
            if(error) {
              res.writeHead(500);
              res.end('500: Failed to load file.');
            } else {
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.end(content);
            }
          });
        } else {
          httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(error, content) {
            if(error) {
              res.writeHead(500);
              res.end();
            } else {
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.end(content);
            }
          });
        }
      } else {
        // Write to file
        console.log(tempData);
        console.log(post.url);
        console.log('writing to file' + post.url);
        fs.appendFile(archive.paths.list, post.url + '\n', function(error) {
          if(error) {
            res.writeHead(500);
            res.end('Internal Server Error');
          } else {
            httpHelpers.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(error, content) {
              if(error) {
                res.writeHead(500);
                res.end();
              } else {
                res.writeHead(302, {'Content-Type': 'text/html'});
                res.end(content);
              }
            });    
          }
        });
      }
    });
  },

  'OPTIONS': function(req, res) {

  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if(action) {
    action(req, res)
  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }

};

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "content-type": "text/html"
};