var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

var actions = {
  'GET': function(req, res) {
    httpHelpers.serveAssets(res, './public/index.html', function(error, content) {
      if(error) {
        res.writeHead(500);
        res.end();
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(content);
      }
    });
  },

  'POST': function(req, res) {
    console.log('post');
    res.writeHead(201);
    res.end();
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
