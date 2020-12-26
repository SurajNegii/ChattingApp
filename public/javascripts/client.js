const socket = io();

$('.send_msg_input_box').on('keyup', function(e) {
    if (e.key === 'Enter') {
        if ($(this).val().length) {
            sendMessage($(this).val());
            $(this).val('');
            // $(this).closest('.chat_window_right').scrollTop($(this).closest('.chat_window_right').height());
        }
    }
});
$('.send_msg_btn').on('click', function() {
    if ($('#send_msg_input_box').val().length) {
        sendMessage($(this).val());
        $(this).val('');
        console.log($(this).closest('.chat_window_right'));
    }
});

function sendMessage(message) {
    let msg = {
        messageSenderId : $('#messageSenderId').val(),
        messageReceiverId : $('#messageReceiverId').val(),
        message : message
    }
    displayMessage(msg, 'outgoingMsg');
    socket.emit('message', msg);
}

function displayMessage(msg, type) {
    console.log(msg.messageReceiverId);
    if (type === 'outgoingMsg') {
        $(`.chat_msg_${msg.messageReceiverId}`).
        append(`<div class='outgoingMsg'>${msg.message}</div>`);
    } else {
        $(`.chat_msg_${msg.messageSenderId}`).
        append(`<div class='incomingMsg'>${msg.message}</div>`);
    }
    // $('.outgoingMsg').closest('.chat_window_right').scrollTop($('.outgoingMsg').closest('.chat_window_right').height());
}

// // Recieve messages 
socket.on('message', (msg) => {
    $(`.users_name[data-userid=${msg.messageSenderId}]`).trigger('click');
    displayMessage(msg, 'incoming');
});