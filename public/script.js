//client-side
var socket = io.connect();



//appends a message to chat entries field
function addMessage(msg, pseudo) {
    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}


//sends message to server for processesing
function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
    	//emit makes call to server to display message
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
    }
}

//where user sets their username for chat
function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
}
//receives message from server to display on user's screen
socket.on('message', function(data) {
    addMessage(data['message'], data['pseudo']);
});

//initializes action listeners on load
$(function() {
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {setPseudo()});
    $("#submit").click(function() {sentMessage();});
});