// var vm = new Vue({
//     el: '#aqq',
//     delimiters: ['[[', ']]'], // 设置vue中的模板语法
//     data: {
//         host,
//         username: sessionStorage.username || localStorage.username,
//         user_id: sessionStorage.user_id || localStorage.user_id,
//         token: sessionStorage.token || localStorage.token,
//         gender: '',
//         mobile : '',
//         email  : '',
//         name :'',
//         profession:'',
//         introduce: '',
//         head:'',
//
//     },
//     mounted: function(){
//
//         if (this.username) {
//                              $('#user_li').css('display', 'block');
//                              $('#logo_li').css('display', 'block');
//                              $('.login_li').css('display', 'none');
//                         } else {
//                             $('.login_li').css('display', 'block');
//                         }
//
//          axios.get(this.host+'/users/user_data/', {
//                 headers: {
//                     'Authorization': 'JWT ' + this.token
//                 },
//                 responseType: 'json',
//                 withCredentials: true
//             })
//             .then(response => {
//                 this.gender = response.data.gender;
//                 this.mobile = response.data.mobile;
//                 this.email  = response.data.email;
//                 this.username   =  response.data.username;
//                 this.name   =  response.data.name;
//                 this.profession   =  response.data.profession;
//                 this.introduce   =  response.data.introduce;
//                 this.head   =  response.data.head;
//             })
//             .catch(error => {
//                 console.log(error.response.data);
//             })
//
//     },
//     methods: {
//
//         sleep(d) {
//                 return new Promise((resolve) => setTimeout(resolve, d))
//             },
//         // 退出
//         logout: function(){
//
//             sessionStorage.clear();
//             localStorage.clear();
//             ShowSuccess('注销成功');
//             this.sleep(3000);
//             location.href = '/gg/login.html';
//         },
//
//     }
//
// });



(function () {
    try {
        if (window.console && window.console.log) {
            console.log("\n欢迎访问WWW.HEANNY.CN！\n\n在本站可以看到前端技术，" +
                "后端程序、摄影作品、网站内容管理系统等文章；\n\n还有我的程序人生！！！\n" +
                "\n请记住我们的网址：%c www.heanny.cn", "color:red");
            console.log("\n联系邮箱：%c lzh@heanny.cn", "color:red");
            // console.log("%c", "padding:50px 300px;line-height:120px;" +
            // "background:url('../images/072156353445447.gif') no-repeat;");
        }
    } catch (e) {
    }
})();
var _hmt = _hmt || [];
(function () {
    //baidu
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?e3c076e221bb27230a158d9cba0a5c70";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
    //zhanzhang
    var cnzz_protocol = (("https:" === document.location.protocol) ? " https://" : " http://");
    document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_1262043670'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol +
        "s22.cnzz.com/z_stat.php%3Fid%3D1262043670%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));
})();

(function () {

    'use strict';


    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    var fullHeight = function () {

        if (!isMobile.any()) {
            $('.js-fullheight').css('height', $(window).height());
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height());
            });
        }

    };

    // Animations

    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn animated');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated');
                            } else {
                                el.addClass('fadeInUp animated');
                            }

                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '85%'});
    };


    var burgerMenu = function () {

        $('.js-fh5co-nav-toggle').on('click', function (event) {
            event.preventDefault();
            var $this = $(this);

            if ($('body').hasClass('offcanvas')) {
                $this.removeClass('active');
                $('body').removeClass('offcanvas');
            } else {
                $this.addClass('active');
                $('body').addClass('offcanvas');
            }
        });


    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-aside, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas')) {

                    $('body').removeClass('offcanvas');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }

            }
        });

        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas')) {

                $('body').removeClass('offcanvas');
                $('.js-fh5co-nav-toggle').removeClass('active');

            }
        });

    };

    var sliderMain = function () {

        $('#fh5co-hero .flexslider').flexslider({
            animation: "fade",
            slideshowSpeed: 5000,
            directionNav: true,
            start: function () {
                setTimeout(function () {
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            },
            before: function () {
                setTimeout(function () {
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            }

        });

    };

    // Document on load.
    $(function () {
        fullHeight();
        contentWayPoint();
        burgerMenu();
        mobileMenuOutsideClick();
        sliderMain();
    });


}());
$('#WeiBo').popover({
    trigger: 'hover',//鼠标以上时触发弹出提示框
    html: true,//开启html 为true的话，data-content里就能放html代码了
    content: "<img src='../img/weibo.png' height='100px'>"
});
$('#WeChat').popover({
    trigger: 'hover',//鼠标以上时触发弹出提示框
    html: true,//开启html 为true的话，data-content里就能放html代码了
    content: "<img src='../img/wechat.png' height='100px'>"
});


function loginCheck() {
    $.post('/api/login.php', {action: 'islogin'}, function (req) {
        user = req.data.user;
        $('.blogNum').html(req.data.blog);
        $('.photoNum').html(req.data.photo);
        $('.shareNum').html(req.data.share);
        $('.gbookNum').html(req.data.gbook);
        $('.Hversion').html(req.data.version);
        if (req.code === 0) {
            var trs = "";
            trs += "<li id='user_li'><a href='user.html' title='用户中心'>" + user + "</a></li>";
            trs += "<li><a href='#' onclick='LogOut()' title='注销'>LOGOUT</a> </li>";
            $('#fh5co-main-menu ul').append(trs);
            $('#login_li').css('display', 'none');
            // class="fh5co-active"
        }
    })
}
function LogOut() {
    $.post('/api/login.php', {action: 'logout'},
        function (req) {
            if (req.code === 0) {
                ShowSuccess('注销成功');
                setTimeout(function () {
                    location.reload()
                }, 1000)
            } else {
                ShowFailure('未知错误')
            }
        })
}

$('#WeiBo').popover({
    trigger: 'hover',//鼠标以上时触发弹出提示框
    html: true,//开启html 为true的话，data-content里就能放html代码了
    content: "<img src='/img/weibo.png' height='100px'>"
});

// 获取参数方法
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//tip是提示信息，type:'success'是成功信息，'danger'是失败信息,'info'是普通信息
function ShowTip(tip, type) {
    var $tip = $('#tip');
    if ($tip.length == 0) {
        $tip = $('<span id="tip" style="font-weight:bold;position:fixed;top:50px;left: 50%;z-index:9999"></span>');
        $('body').append($tip);
    }
    $tip.stop(true).attr('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(500).delay(2000).fadeOut(500);
}

function ShowMsg(msg) {
    ShowTip(msg, 'info');
}

function ShowSuccess(msg) {
    ShowTip(msg, 'success');
}

function ShowFailure(msg) {
    ShowTip(msg, 'danger');
}

function ShowWarn(msg, $focus, clear) {
    ShowTip(msg, 'warning');
    if ($focus) $focus.focus();
    if (clear) $focus.val('');
    return
}

function randint(n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
}
$('.inputCheck').blur(function () {
    if ($(this).val() === '' || $(this).val() === null) {
        $(this).addClass('inputError')
    } else {
        $(this).removeClass('inputError')
    }
});