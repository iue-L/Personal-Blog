import base64

from rest_framework import serializers
#热销商品的序列化器
from news.models import Blog, Comments
from users.models import User

import time

from utils.image_storage import storage


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name",'head')
class HotSkuListSerializer(serializers.ModelSerializer):
    user = AreaSerializer(read_only=True)
    class Meta:
        model = Blog
        fields = ("id","title","time","watch","text",'img','user')



class OrderSettlementSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = ("id","title")



class OrderSettlement(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = ("id", "title",'time','watch','text')




class OrderSettlements(serializers.ModelSerializer):
    user = AreaSerializer(read_only=True)
    class Meta:
        model = Comments
        fields = ("id",'time','text','user')

class RegisterCreateSerializer(serializers.ModelSerializer):
    user = AreaSerializer(read_only=True)
    class Meta:
        model = Comments
        fields = ('id','text','news','time','user')



    def create(self, validated_data):
        # 1,获取用户对象
        user = self.context["request"].user

        comments = super().create(validated_data)
        # 修改密码
        comments.user_id = user.id


        # 获取当前时间
        time_now = int(time.time())
        # 转换成localtime
        time_local = time.localtime(time_now)
        # 转换成新的时间格式(2016-05-09 18:59:20)
        dt = time.strftime("%Y-%m-%d %H:%M:%S", time_local)
        comments.time = dt

        comments.save()

        return comments



class uploadCreateSerializer(serializers.ModelSerializer):
    user = AreaSerializer(read_only=True)
    class Meta:
        model = Blog
        fields = ('id','text','top','user','img','title')



    def create(self, validated_data):
        # 1,获取用户对象


        code = validated_data['img'].replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,','')
        imgData = base64.b64decode(code)
        url = storage(imgData)

        del validated_data['img']



        blog = super().create(validated_data)


        blog.user_id = 12

        blog.img = 'http://pps8t245f.bkt.clouddn.com/'+url
        # 获取当前时间
        time_now = int(time.time())
        # 转换成localtime
        time_local = time.localtime(time_now)
        # 转换成新的时间格式(2016-05-09 18:59:20)
        dt = time.strftime("%Y-%m-%d", time_local)
        blog.time = dt

        blog.save()

        from celery_tasks.html.tasks import generate_static_sku_detail_html
        generate_static_sku_detail_html.delay(blog.id)

        return blog



