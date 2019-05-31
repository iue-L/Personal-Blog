var vm = new Vue({
    el: '#arr',
    delimiters: ['[[', ']]'], // 设置vue中的模板语法
    data: {
        host,
        username: sessionStorage.username || localStorage.username,
        user_id: sessionStorage.user_id || localStorage.user_id,
        token: sessionStorage.token || localStorage.token,
        gender: '',
        mobile: '',
        email: '',
        name: '',
        profession: '',
        introduce: '',
        head: '',
        old_pwd: '',
        new_pwd: '',
        new_cpwd: '',
        error_opwd: false,
        error_pwd: false,
        error_cpwd: false,
        page: 1, // 当前页数
        page_size: 13, // 每页数量
        count: 0,  // 总页数量
        blog: [], // 数据
        blog_s: '', // 数据
        id:''

    },

  methods: {

        comments: function(){
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
  }

})
function PutComPost(id) {
    var comment = $('#P_message').val();
    if (comment === '') {
       ShowFailure('还没有输入评论呢');
        return
    }
    $.post('/api/comment.php', {
            'action': 'putBlogC',
            'reid': id,
            'comment': comment
        },
        function (req) {
            if (req.code===0) {
                ShowSuccess('评论成功');
                $('#P_comment_box textarea').html('');
                // CommentJq.init();//重新加载评论
            } else if (req.code===3) {
                $('#P_comment_box  h4').html('<a href="login.html?url=' + encodeURIComponent(window.location.href) + '">请先登录</a>');
            } else {
                ShowFailure('错误,请重试!');
            }
        })

}

function getContent(id) {
    var pwd = $('#textPWD').val();
    $.post('/api/blog.php', {'action': 'getBlogByPwd', 'id': id, 'pwd': pwd}, function (req) {
        if (req.code == 0) {
            $("#P_note_box .NoteBox").attr('style', 'background-color: white;');
            $("#P_note_box .NoteBody").html(req.data);
            $("#P_note_box .NoteBody .form-inline").hide();
        } else {
            ShowFailure('密码错误')
        }
    })

}

//收藏
function collect(id) {
    if (id === -1) {
        ShowFailure('请先登录');
        setTimeout(function(){
        location.href = '/login.html?url=' + encodeURIComponent(location.href);
},1500)

        return
    }
    $.post('/api/blog.php',{id:id,action:'collect'},function (req) {
        if(req.code===1){
            ShowFailure('请先登录');
        }else if(req.code===0){
            ShowSuccess('已收藏');
            $('.blog_collect').attr('href','javascript:uncollect('+id+')');
            $('.blog_collect img').attr('src','/images/collected.png')
        }else {
            ShowFailure('收藏失败，请重试')
        }
    })
}
//取消收藏
function uncollect(id) {
    ShowMsg(id);
    $.post('/api/blog.php',{id:id,action:'uncollect'},function (req) {
        if(req.code===1){
            ShowFailure('请先登录');
        }else if(req.code===0){
            ShowSuccess('已取消收藏');
            $('.blog_collect').attr('href','javascript:collect('+id+')');
            $('.blog_collect img').attr('src','/images/collect.png');
        }else {
            ShowFailure('取消失败，请重试')
        }
    })
}



