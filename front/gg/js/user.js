/*
*
*
*/
var vm = new Vue({
    el: '.app',
    delimiters: ['[[', ']]'], // 设置vue中的模板语法
    data: {
        host,
        username: sessionStorage.username || localStorage.username,
        user_id: sessionStorage.user_id || localStorage.user_id,
        token: sessionStorage.token || localStorage.token,
        gender: '',
        mobile: '',
        email: '',
        bolg_sid:'',
        name:'',
        profession :  '',
        introduce :'',
        head :'',
        old_pwd: '',
        new_pwd: '',
        new_cpwd: '',
        error_opwd: false,
        error_pwd: false,
        error_cpwd: false,
        blog_namelist:[],
        page: 1, // 当前页数
        page_size: 13, // 每页数量
        count: 0,  // 总页数量
        blog: [], // 数据
        blog_s: '', // 数据
        stack:[],
        commentss:'',//评论
        id:'',//要评论的博客id
        counts:'',
        apply:[],
        apply_name:'申请发布博客',
        administrator: sessionStorage.administrator || localStorage.administrator,
        quantity:'',

    },
    computed: {
        total_page: function(){  // 总页数
            return Math.ceil(this.count/this.page_size);
        },
        next: function(){  // 下一页
            if (this.page >= this.total_page) {
                return 0;
            } else {
                return this.page + 1;
            }
        },
        previous: function(){  // 上一页
            if (this.page <= 0 ) {
                return 0;
            } else {
                return this.page - 1;
            }
        },
        page_nums: function(){  // 页码
            // 分页页数显示计算
            // 1.如果总页数<=5
            // 2.如果当前页是前3页
            // 3.如果当前页是后3页,
            // 4.既不是前3页，也不是后3页
            var nums = [];
            if (this.total_page <= 5) {
                for (var i=1; i<=this.total_page; i++){
                    nums.push(i);
                }
            } else if (this.page <= 3) {
                nums = [1, 2, 3, 4, 5];
            } else if (this.total_page - this.page <= 2) {
                for (var i=this.total_page; i>this.total_page-5; i--) {
                    nums.push(i);
                }
            } else {
                for (var i=this.page-2; i<this.page+3; i++){
                    nums.push(i);
                }
            }
            return nums;
        }
    },
    mounted: function(){


         function getQueryString(name) {
    let reg = `(^|&)${name}=([^&]*)(&|$)`
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
        this.id = getQueryString('id')
        axios.get(this.host+'/news/blog/'+ this.id+'/',  {
                            headers: {
                                'Authorization': 'JWT ' + this.token

                            },
                            responseType: 'json'
                        }


            )
            .then(response => {
                console.log(response.data);


            })
            .catch(error => {
                console.log(error.response.data);
            })



        axios.get(this.host+'/news/categories/blog/', {

                responseType: 'json',
                withCredentials: true
            })
            .then(response => {
                vm.blog = response.data.results;
                vm.count = response.data.count;
                vm.counts = response.data.count;

            })
            .catch(error => {
                console.log(error.response.data);
            })


            axios.get(this.host + '/users/applys/', {
                headers: {
                    'Authorization': 'JWT ' + this.token

                },
                responseType: 'json'
            })
                .then(response => {
                    this.apply_name = response.data.name;


                })
                .catch(error => {
                    console.log(error.response.data);
                })

        axios.get(this.host + '/users/apply_name/', {
                headers: {
                    'Authorization': 'JWT ' + this.token

                },
                responseType: 'json'
            })
                .then(response => {
                    this.apply = response.data;


                })
                .catch(error => {
                    console.log(error.response.data);
                })

        axios.get(this.host+'/users/gbooks/', {

                responseType: 'json'
            })
                .then(response => {
                    $('.gbook_box_li').remove();
                   $.each(response.data, function (n, v) {
                    // console.log(n, v);
                    $('#gbook_div_ov .main-timeline').append(' <div class="timeline  gbook_box_li">' +
                        '<span class="timeline-icon"></span>' +
                        ' <span class="year">' + v.time + '</span>' +
                        '  <div class="timeline-content">' +
                        '  <h3 class="title">' + v.name + '</h3>' +
                        '  <span class="post">' + v.time + '</span>' +
                        '  <p class="description">' + v.text + '</p>' +
                        '  </div>' +
                        ' </div>');
                })


                })
                .catch(error => {
                    console.log(error.response.data);
                })
        axios.get(this.host+'/users/quantity/', {

                responseType: 'json'
            })
                .then(response => {
                    this.quantity = response.data.quantity


                })
                .catch(error => {
                    console.log(error.response.data);
                })


         axios.get(this.host+'/news/comments/'+ this.id+'/',  {
                            headers: {
                                'Authorization': 'JWT ' + this.token

                            },
                            responseType: 'json'
                        }


            )
            .then(response => {
                this.stack = response.data.results;


            })
            .catch(error => {
                console.log(error.response.data);
            })

        if (this.username) {
                             $('#user_li').css('display', 'block');
                             $('#logo_li').css('display', 'block');
                             $('.login_li').css('display', 'none');
                        } else {
                            $('.login_li').css('display', 'block');
                        }

        axios.get(this.host+'/users/user_data/', {
                headers: {
                    'Authorization': 'JWT ' + this.token
                },
                responseType: 'json',
                withCredentials: true
            })
            .then(response => {
                this.gender = response.data.gender;
                this.mobile = response.data.mobile;
                this.email  = response.data.email;
                this.username   =  response.data.username;
                this.name   =  response.data.name;
                this.profession   =  response.data.profession;
                this.introduce   =  response.data.introduce;
                this.head   =  response.data.head;
                this.bolg_sid   =  response.data.bolg_sid;
                vm.administrator   =  response.data.administrator;
            })
            .catch(error => {
                console.log(error.response.data);
            })


        axios.get(this.host+'/news/blog_name/', {
                headers: {
                    'Authorization': 'JWT ' + this.token
                },
                responseType: 'json',
                withCredentials: true
            })
            .then(response => {
                this.blog_namelist = response.data;


            })
            .catch(error => {
                console.log(error.response.data);
            })
    },
    methods: {
        // 点击页数
        on_page: function(num){
            if (num != this.page){
                this.page = num;
                this.get_skus();
            }
        },


        sGbook: function(){

             var user = $('.gUser').val();
        var mail = $('.gMail').val();
        var text = $('#G_message').val();
        if (user === '' || text === '' || mail === '') {
            ShowMsg('请添加文字');
            return
        }
        loader.show();
            axios.post(this.host+'/users/gbook/', {
                    name: user,
                    text: text,
                    email: mail,
                    time:'2001',

                },{
                            headers: {
                                'Authorization': 'JWT ' + vm.token

                            },
                            responseType: 'json'
                        })
                .then(response => {
                    // 保存后端返回的token数
                    ShowSuccess('留言成功');
                    setTimeout(function () {
                            location.reload()
                            }, 1500)

                    // reLoad();
                    // loader.hide();



                })
                .catch(error=> {
                    if (error.response.status == 400) {
                        this.error_sms_code_message = '短信验证码错误';
                        this.error_sms_code = true;
                    } else {
                        console.log(error.response.data);
                    }
                })

        },




        //
        get_skus: function(){
            axios.get(this.host+'/news/categories/blog/', {
                    params: {
                        page: this.page,
                        page_size: this.page_size,
                        ordering: this.ordering
                    },
                    responseType: 'json'
                })
                .then(response => {
                    this.count = response.data.count;
                    this.blog = response.data.results;
                    // for(var i=0; i<this.skus.length; i++){
                    //     this.skus[i].url = '/goods/' + this.skus[i].id + ".html";
                    // }
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        },

        uploads: function(id){
            axios.get(this.host+'/users/Agreed/'+id+'/',{
                headers: {
                    'Authorization': 'JWT ' + this.token
                },
                responseType: 'json',
                withCredentials: true
            })
                .then(response => {

                    alert(response.data.count)
                    window.location.reload()
                    // for(var i=0; i<this.skus.length; i++){
                    //     this.skus[i].url = '/goods/' + this.skus[i].id + ".html";
                    // }
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        },
        uploadss: function(id){
            axios.get(this.host+'/users/Agreeds/'+id+'/',{
                headers: {
                    'Authorization': 'JWT ' + this.token
                },
                responseType: 'json',
                withCredentials: true
            })
                .then(response => {

                    alert(response.data.count)
                    window.location.reload()
                    // for(var i=0; i<this.skus.length; i++){
                    //     this.skus[i].url = '/goods/' + this.skus[i].id + ".html";
                    // }
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        },

        on_apply: function(){
            if (vm.user_id) {
            if (this.apply_name =='申请发布博客') {
            axios.get(this.host+'/users/apply/',  {
                headers: {
                    'Authorization': 'JWT ' + this.token
                },
                responseType: 'json',
                withCredentials: true
            })
                .then(response => {

                    this.apply=this.apply.concat(response.data)
                    this.apply_name = '已申请'


                })
                .catch(error => {
                    console.log(error.response.data);
                })
        }}else {
             location.href = '/gg/login.html?next='+window.location.pathname
        }



        },
        logout: function(){

            sessionStorage.clear();
            localStorage.clear();
            ShowSuccess('注销成功');
            this.sleep(3000);
            location.href = '/gg/login.html';
        },
           // 检查旧密码
        check_opwd: function(){
            if (!vm.old_pwd) {
                vm.error_opwd = true;
            } else {
                vm.error_opwd = false;
            }
        },
        // 检查新密码
        check_pwd: function(){
            len = vm.new_pwd.length;
            if (len<8 || len>20) {
                vm.error_pwd = true;
            } else {
                vm.error_pwd = false;
            }
        },
        // 检查确认密码
        check_cpwd: function(){
            if (vm.new_pwd != vm.new_cpwd) {
                vm.error_cpwd = true;
            } else {
                vm.error_cpwd = false;
            }
        },
        // 修改密码
        change_pwd: function(){
            if (vm.error_pwd || vm.error_cpwd ) {
                return;
            }
            if (vm.user_id && vm.token) {
                axios.put(this.host + '/users/user/'+vm.user_id+'/password/',
                        {
                            old_password: vm.old_pwd,
                            password: vm.new_pwd,
                            password2: vm.new_cpwd
                        },
                        {
                            headers: {
                                'Authorization': 'JWT ' + vm.token
                            },
                            responseType: 'json'
                        }
                    )
                    .then(function(response){
                        $('.user_html_changepwd .btn').val('修改成功');
                            setTimeout(function () {
                            location.reload()
                            }, 1500)
                    })
                    .catch(function(error){
                        if (error.response.status === 403) {
                            alert('修改失败');
                        } else {
                            alert('修改失败');
                        }
                    })
            } else {
                alert('修改失败');
            }
        },
         //上传图片
        upload: function (e) {
            $("#upl").val("真在上传。。。");
            var f = document.getElementById("chuan")
            console.dir(f.files[0]);
            let param = new FormData();
            console.log(f.focus[0]);
            param.append('head', f.files[0]);//通过append向form对象添加数据
            console.log(param.get('icon')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
            let config = {

                headers: {'Authorization': 'JWT ' + this.token, 'Content-Type': 'multipart/form-data'}
            };  //添加请求头
            axios.put(this.host + '/users/users_img/', param, config)
                .then(response => {
                    // this.form.url = this.$store.state.geturl.photourl + response.data.data.url;
                    // console.log(this.form.url)
                    // if (this.form.url) {
                    alert('图片上传成功')
                    location.reload()

                })
        },
         // 评论
        comments: function(){

            axios.post(this.host+'/news/comments/', {
                    text: this.commentss,
                    news: this.id,
                    time:'2001',

                },{
                            headers: {
                                'Authorization': 'JWT ' + vm.token

                            },
                            responseType: 'json'
                        })
                .then(response => {
                    // 保存后端返回的token数



                    this.stack=this.stack.concat(response.data)
                })
                .catch(error=> {
                    if (error.response.status == 400) {
                        this.error_sms_code_message = '短信验证码错误';
                        this.error_sms_code = true;
                    } else {
                        console.log(error.response.data);
                    }
                })

        },
        sleep(d) {
                return new Promise((resolve) => setTimeout(resolve, d))
            },
        // 退出




        // logout: function(){
        //
        //     sessionStorage.clear();
        //     localStorage.clear();
        //     ShowSuccess('注销成功');
        //     this.sleep(3000);
        //     location.href = '/gg/login.html';
        // },

    }

});







// 修改数据事件
function UDoChangeData() {
    var name = $("input#q").val();
    var sex = $('input:radio[name="sex"]:checked').val();
    var mail =$("input#w").val();
    var tel = $("input#e").val();
    var text = $("#demo").val()
    var username = $("input#r").val()
    if (name === '') {
        $('.form_data_error .alert').html('昵称为空');
        $('.form_data_error').css('display', 'block');
        return
    }
    if (sex === '') {
        $('.form_data_error .alert').html('性别为空');
        $('.form_data_error').css('display', 'block');
        return
    }
    if (mail === '') {
        $('.form_data_error .alert').html('邮箱为空');
        $('.form_data_error').css('display', 'block');
        return
    }
    if (tel === '') {
        $('.form_data_error .alert').html('电话为空');
        $('.form_data_error').css('display', 'block');
        return
    }

    $('.form_data_error').css('display', 'none');
    $.post('http://127.0.0.1:8000/users/users_data/',

        {
        'username':username+'矮矮胖胖',
        'name': name,
        'gender': sex,
        'email': mail,
        'mobile': tel,
         'introduce':text
    },



        function (req) {
        if (req.id) {
            $('.user_html_changedata .btn').val('修改成功');
            setTimeout(function () {
                location.reload()
            }, 1500)
        } else {
            $('.form_data_error .alert').html('修改失败');
            $('.form_data_error').css('display', 'block');
        }
    })
}

// 修改密码事件
function UDoChangePwd() {
    var pwd0 = $('#changePwd .form_pwd0 input').val();
    var pwd1 = $('#changePwd .form_pwd1 input').val();
    var pwd2 = $('#changePwd .form_pwd2 input').val();
    if (pwd0 === '' || pwd0 === null) {
        $('.form_pwd_error .alert').html('原密码为空');
        $('.form_pwd_error').css('display', 'block');
        return
    }
    if (pwd1 === '' || pwd1 === null) {
        $('.form_pwd_error .alert').html('新密码为空');
        $('.form_pwd_error').css('display', 'block');
        return
    }
    if (pwd2 === '' || pwd2 === null) {
        $('.form_pwd_error .alert').html('新密码为空');
        $('.form_pwd_error').css('display', 'block');
        return
    }
    if (pwd1 !== pwd2) {
        $('.form_pwd_error .alert').html('两次密码输入不一样');
        $('.form_pwd_error').css('display', 'block');
        return
    }
    $('.form_pwd_error').hide();
    $.post('/api/user/', {

        'pwd0': pwd0,
        'pwd1': pwd1
    }, function (req) {
        if (req.code === 0) {
            $('.user_html_changepwd .btn').val('修改成功');
            setTimeout(function () {
                location.reload()
            }, 1500)
        } else if (req.code === 1) {
            $('.form_pwd_error .alert').html('未登录');
            $('.form_pwd_error').css('display', 'block');
            setTimeout(function () {
                location.href = '/login.html?url=' + encodeURIComponent(location.href)
            }, 1000)
        } else if (req.code === 2) {
            $('.form_pwd_error .alert').html('原始密码错误');
            $('.form_pwd_error').css('display', 'block');
        } else {
            $('.form_pwd_error .alert').html('修改失败');
            $('.form_pwd_error').css('display', 'block');
        }
    })
}

// 充值积分事件
function UDoRecharge() {

}

// 其他金额点击事件
function U_box_other() {
    $('.otheramount').css('display', 'block')
}

// 进度条上传更新时间
function onprogress(evt) {
    var loaded = evt.loaded;     //已经上传大小情况
    var tot = evt.total;      //附件总大小
    var per = Math.floor(100 * loaded / tot);  //已经上传的百分比
    $("#son").html(per + "%");
    $("#son").css("width", per + "%");
}

function loadCollectionMore() {
    $('.user_box_collection li').show();
    $('.user_box_collection .loadmore').hide();
}

function loadBlogMore() {
    $('.user_box_blog li').show();
    $('.user_box_blog .loadmore').hide();
}

function loadPhotoMore() {
    $('.user_box_photo li').show();
    $('.user_box_photo .loadmore').hide();
}




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


