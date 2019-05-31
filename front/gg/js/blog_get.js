$(function () {
    $.post('/api/tag.php', {action: 'getTags10'}, function (req) {
        if (req.code === 0) {
            $.each(req.data, function (n, value) {
                $('.cloud ul').append("<a href='tag.html?id=" + value.id + "&tag=" + escape(value.tag) + "'>" + value.tag + "</a>")
            })
        }
    });
    var pagenum = GetQueryString("page");
    $.post('/api/blog.php', {
            action: 'getBlogs',
            'page': pagenum
        },
        function (req) {
            var allpage = req.msg.all;
            var page = req.msg.page;
            var objdata = req.data;
            //------------遍历对象 .each的使用-------------
            $.each(objdata, function (n, value) {
                $('.blog_box_li_' + n + ' .blogtitle a').html(value.title);
                $('.blog_box_li_' + n + '  a').attr('href', '/post.html?id=' + value.id);
                $('.blog_box_li_' + n + '  .blogpic img').attr('src', '/update/Blog/' + value.img);
                if (value.intro !== '') {
                    $('.blog_box_li_' + n + ' .bloginfo  p').html(value.intro);
                }
                if (value.tags !== '') {
                    $('.blog_box_li_' + n + ' .classname').html(value.tags);
                }
                $('.blog_box_li_' + n + ' .author_user').html(value.name);
                $('.blog_box_li_' + n + ' .viewnum').html(value.view);
                $('.blog_box_li_' + n + ' .dtime').html(value.time);
                $('.blog_box_li_' + n).show();
            });

            //关闭加载动画
            $('#loading_div').css('display', 'none');

            var pagers = "";
            if (page == 1 & allpage == 1) {
                pagers += "<span class=\"disabled\"> << </span>";
                pagers += "<span class=\"current\">1</span>";
                pagers += "<span class=\"disabled\"> >> </span>";
            } else if (page == 1) {
                pagers += "<span class=\"disabled\"> << </span>";
                pagers += "<span class=\"current\">1</span>";
                if ((allpage - 1) <= 5) {
                    for (var i = 2; i <= allpage; i++) {
                        pagers += "<a href=\"?page=" + i + "\">" + i + "</a>";
                    }
                } else {
                    for (var j = 2; j <= 5; j++) {
                        pagers += "<a href=\"?page=" + j + "\">" + j + "</a>";
                    }
                }
                pagers += "<span class=\"current\">……</span>";
                pagers += "<a href=\"?page=" + allpage + "\">>></a>";

            } else if (page == allpage) {
                pagers += "<a href=\"?page=1\"><<</a>";
                if (page <= 5) {
                    for (var k = 1; k < page; k++) {
                        pagers += "<a href=\"?page=" + k + "\">" + k + "</a>";
                    }
                } else {
                    pagers += "<span class=\"current\">……</span>";
                    for (var l = Number(page) - 5; l < page; l++) {
                        pagers += "<a href=\"?page=" + l + "\">" + l + "</a>";
                    }
                }
                pagers += "<span class=\"current\">" + allpage + "</span>";
                pagers += "<span class=\"disabled\"> >> </span>";
            } else {
                pagers += "<a href=\"?page=1\"><<</a>";
                if (page <= 5) {
                    for (var m = 1; m < page; m++) {
                        pagers += "<a href=\"?page=" + m + "\">" + m + "</a>";
                    }
                } else {
                    pagers += "<span class=\"current\">……</span>";
                    for (var n = page - 5; n < page; n++) {
                        pagers += "<a href=\"?page=" + n + "\">" + n + "</a>";
                    }
                }
                pagers += "<span class=\"current\">" + page + "</span>";
                if ((allpage - page) <= 5) {
                    var opage = Number(page) + 1;
                    for (var o = opage; o <= allpage; o++) {
                        pagers += "<a href=\"?page=" + o + "\">" + o + "</a>";
                        console.log(o)
                    }
                    pagers += "<a href=\"?page=" + allpage + "\">>></a>";
                } else {
                    var ppage = Number(page) + 1;
                    for (var p = ppage; p < (Number(page) + 6); p++) {
                        pagers += "<a href=\"?page=" + p + "\">" + p + "</a>";
                    }
                    pagers += "<span class=\"current\">……</span>";
                    pagers += "<a href=\"?page=" + allpage + "\">>></a>";
                }
            }
            $("#page_box").append(pagers);//将数据扔给界面
            $('.page_box').css('display', 'block');
            //关闭加载动画
            $('#loading_div').css('display', 'none');

        });
});