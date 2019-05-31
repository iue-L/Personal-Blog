from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
from utils.models import BaseModel


class User(AbstractUser):
    """用户模型类"""
    mobile = models.CharField(max_length=11, unique=False, verbose_name='手机号')
    gender = models.CharField(max_length=3, unique=False,default='男', verbose_name='性别')
    profession = models.CharField(max_length=10, unique=False,default='博员', verbose_name='职业')
    introduce = models.CharField(max_length=300, unique=False,default='他还没有介绍自己。。。', verbose_name='介绍')
    # head = models.TextField( unique=False,default='http://127.0.0.1:8080/gg/update/HeadPortrait/1904081148091554695289943283.jpg', verbose_name='图片')
    head = models.ImageField(null=True,default='Fo8HIkDewVPK4jrSAEzk0vrdxW5H',verbose_name='图片')
    name = models.CharField(max_length=10, unique=False,default='无', verbose_name='名字')
    bolg_sid = models.CharField(max_length=2, unique=False,default=0, verbose_name='发布博客权限')
    administrator = models.CharField(max_length=2, unique=False,default=0, verbose_name='管理员')
    class Meta:
        db_table = 'tb_users'
        verbose_name = '用户'
        verbose_name_plural = verbose_name


class Userz_apply(BaseModel):


    user = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name="user")


    class Meta:
        db_table = 'tb_users_apply'
        verbose_name = '申请发布博客用户'
        verbose_name_plural = verbose_name


class Message(BaseModel):

    text = models.TextField(unique=False, verbose_name='留言内容')
    name = models.CharField(max_length=11, unique=False, verbose_name='name')
    email = models.CharField(max_length=20, unique=False, verbose_name='邮箱')
    time = models.CharField(max_length=11, unique=False, verbose_name='留言创建时间')


    class Meta:
        db_table = 'tb_message'
        verbose_name = '留言'
        verbose_name_plural = verbose_name