function getChat() {
    $('#convo').css('display', 'block');
    $('#saysomething').css('display', 'none');
    var info = $('#info').val();
    if (info == '') {
        li = '  <li class="chat-thread-left" style="margin-left: 5em">你还没有输入内容哦！</li>';
        $('.chat-thread').append(li);
        $('.chat-thread')[0].scrollTop = $('.chat-thread')[0].scrollHeight;
        return
    }
    liinfo = '<li class="chat-thread-right">' +
        info +
        '</li>';
    $('.chat-thread').append(liinfo);
    $('.chat-thread')[0].scrollTop = $('.chat-thread')[0].scrollHeight;
    $('#fh5co-main input[type=text]').val('');
    $.ajax({
        url: '/api/chat.php',
        // url: '//www.tuling123.com/openapi/api',
        type: 'post',
        data: {
            'info': info
        },
        success: function (req) {
            if (req.code === 0) {
                reinfo=req.data
                li = '  <li class="chat-thread-left" style="margin-left: 5em">' +
                    reinfo.text +
                    '</li>';
                $('.chat-thread').append(li);
                $('.chat-thread')[0].scrollTop = $('.chat-thread')[0].scrollHeight;
                if (reinfo.hasOwnProperty("url")) {
                    li = '  <li class="chat-thread-left" style="margin-left: 5em">' +
                        reinfo.url +
                        '</li>';
                    $('.chat-thread').append(li);
                    $('.chat-thread')[0].scrollTop = $('.chat-thread')[0].scrollHeight;
                }
                if (reinfo.hasOwnProperty("list")) {
                    $.each(reinfo.list, function (n, value) {
                        li = '  <li class="chat-thread-left" style="margin-left: 5em"><img src="' +
                            value.icon +
                            '" style="display: block;max-width: 50%"/><a target="_blank" href ="' +
                            value.detailurl +
                            '">' +
                            value.article +
                            '</a><span style="display: block;">' +
                            value.source +
                            ' 报道</span></li>';
                        $('.chat-thread').append(li);
                        $('.chat-thread')[0].scrollTop = $('.chat-thread')[0].scrollHeight;
                    })
                }
            } else if (req.code === -1) {
                //未登录
                li = '  <li class="chat-thread-left" style="margin-left: 5em">你还没有登录哦，请先<a href="login.html?url=' +
                    window.location.href +
                    '">登录</a>！</li>';
                $('.chat-thread').append(li);
                $('.chat-thread')[0].scrollTop = $('.chat-thread')[0].scrollHeight;
            }else {
                ShowFailure('请重试')
            }
        }
    })
}