var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var nodes = [];

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.emit('initial nodes', nodes);

  socket.on('new node', function(node) {
    console.log(node);
    node.content = '';
    nodes[node.index] = node;
  });

  socket.on('node content change', function(changeData) {
     console.log(changeData);
     nodes[changeData.index].content = changeData.content;
     socket.broadcast.emit('node content change', changeData);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

app.use(express.static('public'));

http.listen(3000, function() {
  console.log('listening on port 3000');
});

