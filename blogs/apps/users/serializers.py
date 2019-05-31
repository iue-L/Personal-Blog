import base64
import random
import re
import time

from rest_framework_jwt.settings import api_settings
from django_redis import get_redis_connection
from rest_framework import serializers

from news.models import Blog
from utils.image_storage import storage
from .models import User, Userz_apply, Message


class Registerds(serializers.ModelSerializer):

    #用户再进行提交的时候有3个数据:校验密码,短信验证码,是否同意协议

    class Meta:
        model = Message
        fields = ('id','name','email','text','time')


class Registerd(serializers.ModelSerializer):

    #用户再进行提交的时候有3个数据:校验密码,短信验证码,是否同意协议

    class Meta:
        model = Message
        fields = ('id','name','email','text','time')


    # 进行校验
    def validate_email(self, value):
        if not re.match(r'^[0-9a-zA-Z\_\-]+(\.[0-9a-zA-Z\_\-]+)*@[0-9a-zA-Z]+(\.[0-9a-zA-Z]+){1,}$', value):
            raise serializers.ValidationError('邮箱格式不正确')
        return value


    def create(self, validated_data):


        message = super().create(validated_data)
        # 修改密码
        # 获取当前时间
        time_now = int(time.time())
        # 转换成localtime
        time_local = time.localtime(time_now)
        # 转换成新的时间格式(2016-05-09 18:59:20)
        dt = time.strftime("%Y-%m-%d", time_local)

        message.time = dt
        message.save()



        return message



class RegisterCreateSerializer(serializers.ModelSerializer):

    #用户再进行提交的时候有3个数据:校验密码,短信验证码,是否同意协议
    #所以,我们需要定义三个字段
    password2 = serializers.CharField(label='校验密码',allow_null=False,allow_blank=False,write_only=True)
    sms_code = serializers.CharField(label='短信验证码',max_length=6,min_length=6,allow_null=False,allow_blank=False,write_only=True)
    token = serializers.CharField(label='登录状态token', read_only=True)  # 增加token字段

    class Meta:
        model = User
        fields = ('id','username','password','mobile','password2','sms_code','email','token')
        extra_kwargs = {
            'id': {'read_only': True},
            'username': {
                'min_length': 5,
                'max_length': 20,
                'error_messages': {
                    'min_length': '仅允许5-20个字符的用户名',
                    'max_length': '仅允许5-20个字符的用户名',
                }
            },
            'password': {
                'write_only': True,
                'min_length': 8,
                'max_length': 20,
                'error_messages': {
                    'min_length': '仅允许8-20个字符的密码',
                    'max_length': '仅允许8-20个字符的密码',
                }
            }
        }

    # 进行校验
    # 单个字段的校验有 手机号码,是否同意协议
    def validate_mobile(self, value):
        if not re.match(r'1[345789]\d{9}', value):
            raise serializers.ValidationError('手机号格式不正确')
        return value

    # 多字段校验, 密码是否一致, 短信是否一致
    def validate(self, attrs):

        # 比较密码
        password = attrs['password']
        password2 = attrs['password2']

        if password != password2:
            raise serializers.ValidationError('密码不一致')
        # 比较手机验证码
        # 获取用户提交的验证码
        code = attrs['sms_code']
        # 获取redis中的验证码
        redis_conn = get_redis_connection('default')
        # 获取手机号码
        mobile = attrs['mobile']
        redis_code = redis_conn.get('sms_%s' % mobile)
        if redis_code is None:
            raise serializers.ValidationError('验证码过期')

        if redis_code.decode() != code:
            raise serializers.ValidationError('验证码不正确')

        return attrs

    def create(self, validated_data):

        # 删除多余字段
        del validated_data['password2']
        del validated_data['sms_code']


        user = super().create(validated_data)
        # 修改密码
        user.set_password(validated_data['password'])
        user.save()

        # 补充生成记录登录状态的token
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        user.token = token

        return user


class UserDetailSerializer(serializers.ModelSerializer):
    """
    用户详细信息序列化器
    """

    class Meta:
        model = User
        fields = ('id', 'username','name', 'mobile', 'email', 'gender','head','introduce','profession','bolg_sid','administrator')

# 修改密码
class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(min_length=8, max_length=20, write_only=True, required=True)
    password2 = serializers.CharField(min_length=8, max_length=20, write_only=True, required=True)

    class Meta:
        model = User
        fields = ['old_password', 'password', 'password2']

    def validate(self, attrs):
        old_password = attrs['old_password']
        password = attrs['password']
        password2 = attrs['password2']

        user = self.context['request'].user

        if not user.check_password(old_password):
            raise serializers.ValidationError('旧密码错误')

        if password != password2:
            raise serializers.ValidationError('两次密码不一致')

        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance

#     # 修改
# class Changeimgs(serializers.ModelSerializer):
#
#     class Meta:
#         model = User
#         fields = ['img']
#
#     def update(self, instance, validated_data):
#         code = validated_data['img'].replace('data:image/jpeg;base64,', '')
#         imgData = base64.b64decode(code)
#         url = storage(imgData)
#
#         instance.img('http://pps8t245f.bkt.clouddn.com/' + url)
#         instance.save()
#
#         return instance




class TUPIANSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "head")

        extra_kwargs = {
            "head": {
                "required": True
            }
        }

        # 重写update方法,不仅保存邮箱给用户, 还要发邮件

    def update(self, instance, validated_data):


        icon = validated_data["head"]
        img_name = random.randint(0, 999999)

        url = storage(icon.read())

        instance.head = url

        instance.save()



        # 3,返回
        return instance







class RegisterCreater(serializers.ModelSerializer):


    class Meta:
        model = User
        fields = ('id','name','mobile','email','gender','introduce','username')


    # 进行校验
    # 单个字段的校验有 手机号码,是否同意协议
    def validate_email(self, value):
        if not re.match(r'^[0-9a-zA-Z\_\-]+(\.[0-9a-zA-Z\_\-]+)*@[0-9a-zA-Z]+(\.[0-9a-zA-Z]+){1,}$', value):
            raise serializers.ValidationError('邮箱格式不正确')
        return value

    def validate_mobile(self, value):
        if not re.match(r'1[345789]\d{9}', value):
            raise serializers.ValidationError('手机号格式不正确')
        return value


    def create(self, validated_data):



        user = User.objects.get(username=validated_data['username'][:-4])

        if validated_data['name']:
            user.name = validated_data['name']
        if validated_data['email']:
            user.email = validated_data['email']
        if validated_data['mobile']:
            user.mobile = validated_data['mobile']
        if validated_data['gender']:
            user.gender = validated_data['gender']
        if validated_data['introduce']:
            user.introduce = validated_data['introduce']


        user.save()



        return user


class AreaSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id','name')





class uploadCreateSerializer(serializers.ModelSerializer):
    user = AreaSerializer(read_only=True)
    class Meta:
        model = Userz_apply
        fields = ('user',)