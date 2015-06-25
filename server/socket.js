var app     = require('express')(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http),
    Redis   = require('ioredis'),
    redis   = new Redis('redis://127.0.0.1:6379/0'),
    pub     = new Redis('redis://127.0.0.1:6379/0');
var port = 8080,
    users = {};
var i =1;

http.listen(port, function() {
    console.log('Listening on *:' + port);
});
io.on('connection', function(socket){
  socket.on('join', function () {
    console.info('New client connected (socket=' + socket.id + ').');
    redis.subscribe(['lobby'], function (err, count) {
    });

    redis.on("message", function (channel, message) {
      console.log('Receive message %s from system in channel %s', message, channel);
      socket.emit(channel, message);
    });
    /*socket.on('rooms.update', function (message) {
      console.log('Receive message ' + message.msg + ' from user in channel chat.message');
      pub.publish('rooms.update', message);
      //io.sockets.emit('chat.message', JSON.stringify(message));
    });*/
    socket.on('disconnect', function() {
      console.info('Client gone (socket=' + socket.id + ').');
    });


  });
});

