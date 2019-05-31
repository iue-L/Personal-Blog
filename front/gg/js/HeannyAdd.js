function fileSelectHandler() {
    // get selected file
    var oFile = $('#image_file')[0].files[0];
    // hide all errors
    $('#error_box').hide();
    // check for image type (jpg and png are allowed)
    var rFilter = /^(image\/jpeg|image\/png|image\/jpg)$/i;
    if (!rFilter.test(oFile.type)) {
        ShowMsg('请选择jpg、jpeg或png格式的图片');
        $('#image_file').val('');
        return;
    }
    // check for file size

    if (oFile.size > 1000 * 1024) {
        ShowMsg('请上传小于1M的图片');
        // return;
    }
    // preview element
    var oImage = document.getElementById('preview');
    // prepare HTML5 FileReader
    var oReader = new FileReader();
    oReader.onload = function (e) {
        // e.target.result contains the DataURL which we can use as a source of the image
        console.log(e.target.result)
        oImage.src = e.target.result;
        oImage.onload = function () { // onload event handler
            // display step 2
            $('.step2').fadeIn(500);
            // Create variables (in this scope) to hold the Jcrop API and image size
            var jcrop_api, boundx, boundy;
            // destroy Jcrop if it is existed
            if (typeof jcrop_api != 'undefined')
                jcrop_api.destroy();
        };
    };
    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
}

//添加blog
function AddBlogData() {
    // var htmlData = editor.txt.html();
    var htmlData = UE.getEditor('editor').getContent();
    // var textData = editor.txt.text();
    var textData = UE.getEditor('editor').getContentTxt();
    var title = $('input[name=title]').val();
    var tag = $('input[name=tag]').val();
    var file = $('#uploadImageDiv img').attr('src');
    if ($('.encryption').bootstrapSwitch('state')) {
        var encry = 1;
        var en_pwd = $('.en_pwd_box').val();
    } else {
        var encry = 0;
        var en_pwd = '';
    }
    if ($('.topSwitch').bootstrapSwitch('state')) {
        var top = 1;
    } else {
        var top = 0;
    }
    if (title === '' || title == null) {
        ShowFailure('标题为空');
        document.form.title.focus();
        return;
    }
    if (htmlData === '' || htmlData == null) {
        ShowFailure('内容为空');
        return;
    }
    $("#but").val("真在上传。。。");
    $.post(this.host+'/news/upload/', {
        'text': htmlData,
        'tag': tag,
        'title': title,
        'encry': encry,
        'en_pwd': en_pwd,
        'img': file,
        'intro': textData,
        'top': top
    }, function (req) {
        if (req.id) {
            ShowSuccess('发布成功！');
            location.href ='/gg/blog.html'
        } else if (req.code === 2) {
            ShowWarn('未登录！');
            setTimeout(function () {
                location.href = 'login.html?url=' + decodeURIComponent(window.location.href);
            }, 2000)
        } else {
            ShowWarn('未知错误！');
        }

    })
}

function initUpBar() {
    var pre = 0;
    $("#son").html("0%");
    $("#son").css("width", "0%");
}

// 添加图片
function AddPhotoData() {
    var title = $('input[name=title]').val();
    var file = $('input[name=file]').val();
    if (title === '' || title == null) {
        ShowFailure('标题为空');
        document.form.title.focus();
        return;
    }
    if (file == '' || file == null) {
        ShowFailure('图片为空');
        document.form.file.focus();
        return;
    }

    var fd = new FormData();
    fd.append("action", 'addPhoto');
    console.log(fd);
    fd.append("title", '' + title);
    fd.append("upload", $("#image_file").get(0).files[0]);
    console.log(fd);
    $.ajax({
        url: "/api/photo.php",
        type: "POST",
        processData: false,// 是否序列化data属性，默认true(注意：false时type必须是post，
        contentType: false,// 当有文件要上传时，此项是必须的，否则后台无法识别文件流的起始位置
        data: fd,
        xhr: function () {
            $('.UpProgressBar').css('display', 'block');
            var xhr = $.ajaxSettings.xhr();
            if (onprogress && xhr.upload) {
                xhr.upload.addEventListener("progress", onprogress, false);
                return xhr;
            }
        },
        success: function (req) {
            if (req.code === 0) {
                ShowSuccess('上传成功');
                setTimeout(function () {
                    location.reload()
                }, 1500)
            } else if (req.code === 2) {
                ShowMsg('图片为空');
            } else if (req.code === 3) {
                ShowMsg('未登录');
                setTimeout(function () {
                    location.href = 'login.html?url=' + window.location.href;
                }, 1500)
            } else if (req.code === 4) {
                ShowMsg('格式错误');
            } else {
                ShowFailure('上传失败');
            }
        },
        error: function (e) {
            ShowFailure('服务器错误');
        }
    });
}

// 进度条上传更新时间
function onprogress(evt) {
    var loaded = evt.loaded;     //已经上传大小情况
    var tot = evt.total;      //附件总大小
    var per = Math.floor(100 * loaded / tot);  //已经上传的百分比
    $("#son").html(per + "%");
    $("#son").css("width", per + "%");
}


//新建分享
function AddShareData() {
    var title = $('input[name=title]').val();
    var text = $('input[name=stext]').val();
    var file = $('#uploadImageDiv img').attr('src');
    var bdurl = $('input[name=bdurl] ').val();
    var bdpwd = $('input[name=bdpwd]').val();
    var cclass = $('select[name=cclass]').val();
    if (title === '' ||  file === '' || bdurl === '' || bdpwd === '' || cclass === '') {
        ShowMsg('必填项没填呢');
        return false
    }
    $.post('/api/share.php', {
        action: 'addShare',
        title: title,
        text: text,
        bdurl: bdurl,
        bdpwd: bdpwd,
        file: file,
        class: cclass
    }, function (req) {
        if(req.code===0){
            ShowSuccess('添加成功');
            setTimeout(function () {
                location.reload();
            },2000)
        }else if(req.code===1){
            ShowFailure('添加失败，请重试');
        }else if(req.code===2){
            ShowFailure('未登录');
            setTimeout(function () {
                location.href = 'login.html?url=' + window.location.href;
            }, 1500)
        }else{
            ShowFailure('未知错误，请重试')
        }
    })
}