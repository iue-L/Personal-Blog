from rest_framework import serializers
from .utils import check_save_user_openid
from django_redis import get_redis_connection
from users.models import User
from .models import OAuthQQUser
class QQUserSerializer(serializers.Serializer):
    mobile = serializers.CharField(label="username")
    password = serializers.CharField(label="密码",min_length=8,max_length=20)
    access_token = serializers.CharField(label="token",min_length=1)

    def validate(self, attrs):
        """多字段校验"""
        #1,获取加密的openid
        access_token = attrs["access_token"]

        #2,调用方法解密openid,判断是否存在
        openid = check_save_user_openid(access_token)

        if not openid:
            raise serializers.ValidationError("openid失效")

        #3,获取redis中的短信,判断为空,正确性
        mobile = attrs["mobile"]

        #4,通过手机号查询美多用户是否存在,判断密码正确性
        user = None
        try:
            user = User.objects.get(username=mobile)
        except User.DoesNotExist:
            pass
        else:
            #5,表示美多用户存在,判断密码正确性
            if not user.check_password(attrs["password"]):
                raise serializers.ValidationError("密码错误")

        #6,返回校验之后的内容
        attrs["openid"] = openid
        attrs["user"] = user
        return attrs

    #重写create方法,创建qq用户
    def create(self, validated_data):
        """validated_data,就上面返回的attrs"""
        #1,创建qq用户
        oauth_qq = OAuthQQUser()

        #2,判断用户是否存在,如果存在设置属性,如果不存在直接创建
        user = validated_data["user"]
        if not user:
            user = User.objects.create(
                username=validated_data["mobile"],
                mobile=validated_data["mobile"],
            )
            user.set_password(validated_data["password"])
            user.save()

        #3,设置qq用户属性
        oauth_qq.openid = validated_data["openid"]
        oauth_qq.user = user
        oauth_qq.save()

        #4,返回
        return oauth_qq