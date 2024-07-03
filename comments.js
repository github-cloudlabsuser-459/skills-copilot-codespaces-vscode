// Create web server and handle requests
var http = require('http');
var fs = require('fs');
var url = require('url');
var comments = require('./comments');

function sendResponse(response, statusCode, headers, data) {
  response.writeHead(statusCode, headers);
  response.end(data);
}

function sendNotFound(response) {
  sendResponse(response, 404, {
    'Content-Type': 'text/plain'
  }, '404 Not Found\n');
}

function sendError(response, error) {
  sendResponse(response, 500, {
    'Content-Type': 'text/plain'
  }, 'Internal Server Error: ' + error + '\n');
}

function sendComments(response) {
  sendResponse(response, 200, {
    'Content-Type': 'application/json'
  }, JSON.stringify(comments.getComments()));
}

function addComment(request, response) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    comments.addComment(JSON.parse(data));
    sendResponse(response, 200, {
      'Content-Type': 'application/json'
    }, JSON.stringify({}));
  });
}

function handleRequest(request, response) {
  var uri = url.parse(request.url).pathname;
  if (uri === '/comments' && request.method === 'GET') {
    sendComments(response);
  } else if (uri === '/comments' && request.method === 'POST') {
    addComment(request, response);
  } else {
    sendNotFound(response);
  }
}

var server = http.createServer(handleRequest);
server.listen(8000, function() {
  console.log('Listening on port 8000');
});