var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var qs = require('querystring');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    if(req.url === '/') {
      httpHelpers.serveAssets(res, './public/index.html', function(error, content) {
        if(error) {
          res.writeHead(500);
          res.end();
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
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
          httpHelpers.serveAssets(res, './public/loading.html', function(error, content) {
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
        fs.appendFile(archive.paths.list, post.url + '\n', function(error) {
          if(error) {
            res.writeHead(500);
            res.end('Internal Server Error');
          } else {
            res.writeHead(302);
            res.end();    
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
