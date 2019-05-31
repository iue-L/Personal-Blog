var qq = new Vue({
    el: '#add',
    data: {
        host: host,
        error_username: false,
        error_pwd: false,
        error_pwd_message: '请填写密码',
        username: '',
        password: '',
        remember: false
    },
    methods: {

        // qq登录
        qq_login: function(){
            var next = this.get_query_string('next') || '/';
            axios.get(this.host + '/oauth/qq/statues/?state=' + next, {
                    responseType: 'json'
                })
                .then(response => {
                    location.href = response.data.login_url;
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        },

        // 获取url路径参数
        get_query_string: function(name){
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
        },
        // 检查数据
        check_username: function(){
            if (!this.username) {
                this.error_username = true;
            } else {
                this.error_username = false;
            }
        },
        check_pwd: function(){
            if (!this.password) {
                this.error_pwd_message = '请填写密码';
                this.error_pwd = true;
            } else {
                this.error_pwd = false;
            }
        },
        // 表单提交
        on_submit: function(){
            this.check_username();
            this.check_pwd();

            if (this.error_username == false && this.error_pwd == false) {
                axios.post(this.host+'/users/auths/', {
                        username: this.username,
                        password: this.password
                    }, {
                        responseType: 'json',
                    })
                    .then(response => {
                         $('.col-md-12').css('display', 'none');
                        $('.col-md-4').css('display', 'none');
                        $('#error_box').css('display', 'none');
                        $('#success_box').css('display', 'block');
                        // 使用浏览器本地存储保存token
                        if (this.remember) {
                            // 记住登录

                            sessionStorage.clear();
                            localStorage.token = response.data.token;
                            localStorage.user_id = response.data.user_id;
                            localStorage.username = response.data.username;
                            localStorage.name = response.data.name;
                            localStorage.gender = response.data.gender;
                            localStorage.mobile = response.data.mobile;
                            localStorage.email = response.data.email;
                            localStorage.administrator = response.data.administrator;
                        } else {
                            // 未记住登录
                            localStorage.clear();
                            sessionStorage.token = response.data.token;
                            sessionStorage.user_id = response.data.user_id;
                            sessionStorage.username = response.data.username;
                            sessionStorage.administrator = response.data.administrator;

                        }

                        // 跳转页面
                        var return_url = this.get_query_string('next');


                         if (!return_url) {
                    setTimeout(function (args) {
                        location.href = '/gg/blogs.html';
                    }, 2000);
                } else {
                    setTimeout(function (args) {
                        location.href = return_url
                    }, 2000);
                }
                    })
                    .catch(non_field_errors => {
                        alert('用户名或密码错误')

                    })
            }
        },
    }
});








var vm = new Vue({
    el: '#app',
    data: {
        host,
        error_name: false,
        error_password: false,
        error_check_password: false,
        error_phone: false,
        error_allow: false,
        error_image_code: false,
        error_sms_code: false,

        username: '',
        email:'',
        password: '',
        password2: '',
        mobile: '',
        image_code: '',
        sms_code: '',
        allow: false,

        error_name_message: '请输入5-20个字符的用户',
        error_phone_message: '您输入的手机号格式不正确',

        image_code_id: '',  // 图片验证码编号
        image_code_url: '',  // 验证码图片路径

        sending_flag: false,
        sms_code_tip: '获取短信验证码',
        error_image_code_message: '请填写图片验证码',
        error_sms_code_message: '请填写短信验证码',

    },


    methods: {

		check_pwd: function (){
			var len = this.password.length;
			if(len<8||len>20){
				this.error_password = true;
			} else {
				this.error_password = false;
			}
		},
		check_cpwd: function (){
			if(this.password!=this.password2) {
				this.error_check_password = true;
			} else {
				this.error_check_password = false;
			}
		},

		check_image_code: function (){
			if(!this.image_code) {
				this.error_image_code = true;
			} else {
				this.error_image_code = false;
			}
		},
		check_sms_code: function(){
			if(!this.sms_code){
				this.error_sms_code = true;
			} else {
				this.error_sms_code = false;
			}
		},


        //发送短信验证码
        send_sms_code: function () {
            if (this.sending_flag == true) {
                return;
            }
            this.sending_flag = true;

            // 校验参数，保证输入框有数据填写
            this.check_phone();
            this.check_image_code();

            if (this.error_phone == true || this.error_image_code == true) {
                this.sending_flag = false;
                return;
            }

            // 向后端接口发送请求，让后端发送短信验证码
            axios.get(this.host+'/verifications/smscodes/' + this.mobile , {
                    // 向后端声明，请返回json数据
                    responseType: 'json'
                })
                .then(response => {
                    // 表示后端发送短信成功
                    // 倒计时60秒，60秒后允许用户再次点击发送短信验证码的按钮
                    var num = 60;
                    // 设置一个计时器
                    var t = setInterval(() => {
                        if (num == 1) {
                            // 如果计时器到最后, 清除计时器对象
                            clearInterval(t);
                            // 将点击获取验证码的按钮展示的文本回复成原始文本
                            this.sms_code_tip = '获取短信验证码';
                            // 将点击按钮的onclick事件函数恢复回去
                            this.sending_flag = false;
                        } else {
                            num -= 1;
                            // 展示倒计时信息
                            this.sms_code_tip = num + '秒';
                        }
                    }, 1000, 60)
                })
                .catch(error => {
                    if (error.response.status == 400) {
                        this.error_image_code_message = '图片验证码有误';
                        this.error_image_code = true;
                    } else {
                        console.log(error.response.data);
                    }
                    this.sending_flag = false;
                })
        },


        check_phone: function (){
            var re = /^1[345789]\d{9}$/;
            if(re.test(this.mobile)) {
                this.error_phone = false;
            } else {
                this.error_phone_message = '您输入的手机号格式不正确';
                this.error_phone = true;
            }
            if (this.error_phone == false) {
                axios.get(this.host+'/users/phones/'+ this.mobile + '/count/', {
                        responseType: 'json'
                    })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_phone_message = '手机号已存在';
                            this.error_phone = true;
                        } else {
                            this.error_phone = false;
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    })
            }
        },

        check_username: function () {
            var len = this.username.length;
            if (len < 5 || len > 20) {
                this.error_name = true;
            } else {
                this.error_name_message = '请输入5-20个字符的用户名';
                this.error_name = false;
            }
            // 检查重名
            if (this.error_name == false) {
                axios.get(this.host + '/users/usernames/' + this.username + '/count/', {
                    responseType: 'json'
                })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_name_message = '用户名已存在';
                            this.error_name = true;
                        } else {
                            this.error_name = false;
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    })
            }
        },

         // 注册
        on_submit: function(){
            this.check_username();
            this.check_pwd();
            this.check_cpwd();
            this.check_phone();
            this.check_sms_code();


            if(this.error_name == false && this.error_password == false && this.error_check_password == false
                && this.error_phone == false && this.error_sms_code == false) {
                axios.post(this.host+'/users/user/', {
                        username: this.username,
                        password: this.password,
                        password2: this.password2,
                        mobile: this.mobile,
                        sms_code: this.sms_code,
                        email: this.email

                    }, {
                        responseType: 'json'
                    })
                    .then(response => {
                        // 保存后端返回的token数据

                        sessionStorage.clear();
                        localStorage.clear();
                        localStorage.token = response.data.token;
                        localStorage.username = response.data.username;
                        localStorage.user_id = response.data.id;

                        location.href = '/gg/login.html';
                    })
                    .catch(error=> {
                        if (error.response.status == 400) {
                            this.error_sms_code_message = '短信验证码错误';
                            this.error_sms_code = true;
                        } else {
                            console.log(error.response.data);
                        }
                    })
            }
        },

    },

});




$(document).keypress(function (e) {
    // 回车键事件
    if (e.which === 13) {
        dologin();
    }
});

var a = window.location.hash;
var b = a.substr(1);
if (b === 'register') {
    $('.login_box').css('display', 'none')
    $('.register_box').css('display', 'block')
    document.title = 'Sign Up | 我不是你的肖奈';
}//注册地址
// 获取验证码
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
var loader = new SVGLoader(document.getElementById('loader'), {speedIn: 300, easingIn: mina.easeinout});

dologin =function () {

    // $('.col-md-4 h2').html('登录失败');
    var username = $('#username').val();
    var password = $('#password').val();
    if (username === '') {
        $('#error_box div').html('账户为空');
        $('#error_box').css('display', 'block');
        setTimeout(function () {
            loader.hide();
        }, 300)
        return
    }
    if (password === '') {
        $('#error_box div').html('密码为空');
        $('#error_box').css('display', 'block');
        setTimeout(function () {
            loader.hide();
        }, 300)
        return
    }
    loader.show();
    $.post('/api/login.php', {
            action: 'login',
            username: username,
            password: password
        },
        function (data) {
            loader.hide();
            if (data.code === 0) {
                $('.col-md-12').css('display', 'none');
                $('.col-md-4').css('display', 'none');
                $('#error_box').css('display', 'none');
                $('#success_box').css('display', 'block');
                reUrl = GetQueryString('url');
                if (reUrl == null || reUrl === '') {
                    setTimeout(function (args) {
                        location.href = '/user.html';
                    }, 1000);
                } else {
                    setTimeout(function (args) {
                        location.href = decodeURIComponent(reUrl);
                    }, 1000);
                }
            } else if (data.code === 2) {
                $('#error_box div').html('账户错误');
                $('#error_box').css('display', 'block');

            } else {
                $('#error_box div').html('密码错误');
                $('#error_box').css('display', 'block');
            }
        })
};

function GetVeCode() {
    var mail = $('#mail_r').val();
    var Mobile = $('#name_r').val();
    //校验
    if (!mail.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {
        $('#error_box2 div').html('邮箱格式错误！');
        $('#error_box2').css('display', 'block');
        $("#email1").focus();
        return
    }
    curCount = count;
    //设置button效果，开始计时
    $("#btnSendCode").attr("disabled", "true");
    $("#btnSendCode").val("" + curCount + "秒后重新获取");
    InterValObj = window.setInterval(SetRemainTime, 1000);
    $.post('http://127.0.0.1:8000'+'/users/smscodes/', {
            // 'action': 'sendmail',
            'mail': mail,
            'Mobile':Mobile

        },
        function (req) {
            // data = JSON.parse(req);
            if (req.code === 0) {
                alert(req.sms);
            } else {
                alert('发送失败')
            }
        })
};

// 修改按钮重新获取
function SetRemainTime() {
    if (curCount === 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").removeAttr("disabled");//启用按钮
        $("#btnSendCode").val("重新发送");
    }
    else {
        curCount--;
        $("#btnSendCode").val("" + curCount + "秒后重新获取");
    }
};

// 切换注册
function register() {
    $('.login_box').css('display', 'none');
    $('.register_box').css('display', 'block');
    document.title = 'Sign Up | 我不是你的肖奈';
};

// 切换登陆
function login() {
    $('.register_box').css('display', 'none');
    $('.login_box').css('display', 'block');
    document.title = 'Sign In | 我不是你的肖奈';
};

// function RegisterDo() {
//     var user = $('#user_r').val();
//     var pwd = $('#pwd_r').val();
//     var pwd2 = $('#pwd_r2').val();
//     var mobile = $('#name_r').val();
//     var mail = $('#mail_r').val();
//     var code = $('#code_r').val();
//
//     if (user === '') {
//         $('#error_box2 div').html('用户名为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (mobile === '') {
//         $('#error_box2 div').html('昵称为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (pwd === '') {
//         $('#error_box2 div').html('密码为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (pwd2 === '') {
//         $('#error_box2 div').html('密码为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (mail === '') {
//         $('#error_box2 div').html('邮箱为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (code === '') {
//         $('#error_box2 div').html('验证码为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//
//     if (pwd !== pwd2) {
//         $('#error_box2 div').html('两次密码输入不一样！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     $('#error_box2').css('display', 'none');
//     $.post('127.0.0.1:8000/users/', {
//         'username': user,
//         'mobile': mobile,
//         'password': pwd,
//         'password2': pwd2,
//         'emaill': mail,
//         'sms_code': code
//     }, function (req) {
//         if (req.code === 2) {
//             $('#error_box2 div').html('验证码错误！');
//             $('#error_box2').css('display', 'block');
//         } else if (req.code === 0) {
//             ShowSuccess('注册成功！');
//             $('#RegisterBut').val('注册成功！');
//             setTimeout(function () {
//                 location.href = 'login.html';
//             }, 1000)
//         } else {
//             $('#error_box2 div').html('注册失败，请重试！');
//             $('#error_box2').css('display', 'block');
//         }
//     })
//
// }
//
// function RegisterDoByOther(web) {
//     var user = $('#user_r').val();
//     var pwd = $('#pwd_r').val();
//     var pwd2 = $('#pwd_r2').val();
//     var mail = $('#mail_r').val();
//     var code = $('#code_r').val();
//     var name = $('#name_r').val();
//     var uid = $('#sfUid').val();
//     if (user === '') {
//         $('#error_box2 div').html('用户名为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (name === '') {
//         $('#error_box2 div').html('昵称为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (pwd === '') {
//         $('#error_box2 div').html('密码为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (pwd2 === '') {
//         $('#error_box2 div').html('密码为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (mail === '') {
//         $('#error_box2 div').html('邮箱为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     if (code === '') {
//         $('#error_box2 div').html('验证码为空！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//
//     if (pwd !== pwd2) {
//         $('#error_box2 div').html('两次密码输入不一样！');
//         $('#error_box2').css('display', 'block');
//         return
//     }
//     $('#error_box2').css('display', 'none');
//     $.post('/api/login.php', {
//         'action': 'regByUid',
//         'uweb': web,
//         'user': user,
//         'name': name,
//         'pwd': pwd,
//         'mail': mail,
//         'uid': uid,
//         'code': code
//     }, function (req) {
//         if (req.code === 2) {
//             $('#error_box2 div').html('验证码错误！');
//             $('#error_box2').css('display', 'block');
//         } else if (req.code === 0) {
//             ShowSuccess('注册成功！');
//             $('#RegisterBut').val('注册成功！');
//             setTimeout(function () {
//                 location.href = 'login.html';
//             }, 1000)
//         } else {
//             $('#error_box2 div').html('注册失败，请重试！');
//             $('#error_box2').css('display', 'block');
//         }
//     })
//
// }


// 登录方法
// $('.login_do_fun').click(function (event) {
//
// })

