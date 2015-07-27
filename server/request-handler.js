/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');
var url = require('url');
var utils = require('./utils');

var messageObj = {
  results: [],
  id: 0
};


module.exports = function(request, response) {
  if(request.method === 'POST') {
    //var messageObj = JSON.parse(fs.readFileSync('messages.txt'));
    utils.collectData(request, function(msg) {
      msg['createdAt'] = (new Date()).getTime();
      msg['objectId'] = messageObj.id++;
      if(!msg.roomname) {
        msg.roomname = '';
      }
      messageObj.results.push(msg);
      fs.writeFile('messages.txt', JSON.stringify(messageObj));
    });
    utils.sendResponse(response, 'OK', 201);
  }
  else if(request.method === 'GET') {
    //var messageObj = JSON.parse(fs.readFileSync('messages.txt'));
    var url_parts = url.parse(request.url, true);
    var orderBy = url_parts.query.order;
    if(orderBy) {
      var opposite = orderBy[0] === '-';
      if(opposite) {
        orderBy = orderBy.substring(1);
      }
      messageObj.results.sort(function(a, b) {
        return (opposite ? a[orderBy] < b[orderBy] : a[orderBy] > b[orderBy]);
      });
    }
    utils.sendResponse(response, messageObj, 200);
  }
  else if( request.method === 'OPTIONS') {
    utils.sendResponse(response, 'OK', 200);
  }

};

