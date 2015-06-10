feed = (function () {
  var socket = new io.connect('http://10.50.2.78:8080', {
      'reconnection': true,
      'reconnectionDelay': 1000,
      'reconnectionDelayMax' : 5000,
      'reconnectionAttempts': 5
      });
  return {
    init: function(){
      socket.on('connect', function (user) {
        socket.emit('join');
      });
    },
    onChange: function(callback) {
      socket.on('rooms.update', callback);
    },
    new: function(room) {
        //socket.emit('join', symbols);
    },
    delete: function(room) {
        //socket.emit('leave', symbol);
    },
    update: function(room){

    }
  };

}());