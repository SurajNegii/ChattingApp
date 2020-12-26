$('.users_name').on('click', function() {
    const messageSender = $('#messageSenderId').val();
    const messageReceiver = $(this).data('userid');
    $('#messageReceiverId').val(messageReceiver);
    $('.users_name').removeClass('user_clicked');
    $('.users_name').addClass('user_name_hover');
    $(this).removeClass('user_name_hover');
    $(this).addClass('user_clicked');
    $('.chat_window_center_logo').css('display', 'none');
    $('.chat_window_right').css('display', 'none');
    $(`.${messageReceiver}`).css('display', 'block');
});

$('.home-icon').on('click', function() {
    $('.chat_window_right').css('display', 'none');
    // $('.chat_window_center_logo').css('display', 'block');
    $('.chat_window_center_logo').css('display', 'flex');
    $('.users_name').removeClass('user_clicked');
});