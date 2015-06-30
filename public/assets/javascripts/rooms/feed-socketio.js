feed = (function () {
  var socket = new io.connect('http://localhost:8080', {
      'reconnection': true,
      'reconnectionDelay': 1000,
      'reconnectionDelayMax' : 5000,
      'reconnectionAttempts': 5
      });
  return {
    init: function(callback){
      $.ajax({
        url:'/rooms.json',
        type:'GET',
      }).done(function(rooms){
        $.each(rooms,function(i,room){
          callback(room)
        })
      });
      socket.on('connect', function (user) {
        socket.emit('join');
      });
    },
    onChange: function(callback) {
      socket.on('lobby', callback);
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