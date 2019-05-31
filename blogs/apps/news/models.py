from django.db import models

from users.models import User


class Blog(models.Model):
    """博客"""

    #标题
    title = models.CharField(max_length=100, unique=False, verbose_name='标题')
    #文章创建事件 2018-09-05
    time = models.CharField(max_length=11, unique=False, verbose_name='文章创建时间')
    #观看人数
    watch = models.CharField(max_length=100,default=0, unique=False, verbose_name='观看人数')

    #内容
    text = models.TextField( unique=False, verbose_name='文章内容')
    #图片
    img = models.TextField( unique=False, default='http://127.0.0.1:8080/gg/picture/1903051025511551752751166329.jpg',verbose_name='图片')

    #用户id
    user = models.ForeignKey(User, on_delete=models.PROTECT,default=12, verbose_name="user")

    top = models.CharField(max_length=2, unique=False,default=0, verbose_name='文章置顶')

    class Meta:
        #排序
        # ordering = ['watch']
        db_table = 'tb_blog'
        verbose_name = '博客'
        verbose_name_plural = verbose_name




class Comments(models.Model):

    # 内容
    text = models.CharField(max_length=1000, unique=False, verbose_name='评论内容')

    # 用户id
    user = models.ForeignKey(User, on_delete=models.PROTECT, default=12, verbose_name="user")

    #博客id
    news = models.ForeignKey(Blog, on_delete=models.PROTECT, default=12, verbose_name="news")

    time= models.CharField(max_length=20, unique=False, verbose_name='评论创建时间')



    class Meta:
        db_table = 'tb_comments'
        verbose_name = '评论'
        verbose_name_plural = verbose_name