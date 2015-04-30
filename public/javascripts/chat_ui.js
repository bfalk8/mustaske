var socket = io.connect();

function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val()
    , systemMessage;

  if (message[0] == '/') {
    systemMessage = chatApp.processCommand($('#room').text(), message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-message').val('');
}

$(document).ready(function() {
  var chatApp = new Chat(socket);

  socket.on('nameResult', function(result) {
    var message;

    if (result.success) {
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result) {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  socket.on('message', function (message) {
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  socket.on('all rooms', function(rooms) {
    $('#room-list').empty();

    // console.log(rooms);
    for(var room_key in rooms) {
      room = rooms[room_key];
      // console.log(rooms[room_key]);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    $('#room-list div').click(function() {
      console.log(socket);  
      chatApp.processCommand(
        $('#room').text(),
        '/join ' + $(this).text()
      );
      $('#send-message').focus();
    });
  });

  setInterval(function() {
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();

  $('#send-form').submit(function() {
    processUserInput(chatApp, socket);
    return false;
  });

  $('#send-button').click(function() {
    processUserInput(chatApp, socket);
  });
});
