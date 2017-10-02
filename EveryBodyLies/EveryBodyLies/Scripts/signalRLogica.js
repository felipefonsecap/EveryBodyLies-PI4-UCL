$(function () {
    $("#jaRegistrado").hide();
    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message.
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        // Add the message to the page.
        $('#discussion').append('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };

    chat.client.registerComplete = function (message, quantidade) {
        $("#jaRegistrado").show();
        $("#registrar").hide();

        $("#nomeJogador").text("Nome: " + message);
        console.log(quantidade);

        if (quantidade == 1) {
            $("#jogador1").text(message);
        } else {
            if (quantidade == 2) {
                $("#jogador2").text(message);
            }
        }
    }   

    // Set initial focus to message input box.
    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            // Call the Send method on the hub.
            chat.server.send($('#message').val());
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });

        $("#participar").click(function () {
            chat.server.registerClient($("#nome").val());
        })
    });
});