from random import randint, random

from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django_redis import get_redis_connection
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView

from news.models import Blog
from .serializers import RegisterCreateSerializer, UserDetailSerializer, ChangePasswordSerializer, RegisterCreater, \
    TUPIANSerializer, uploadCreateSerializer, Registerd, Registerds

from .models import User, Userz_apply, Message
import random
class  RegisterUsernameCountAPIView(APIView):
    """
    获取用户名的个数
    GET:  /users/usernames/(?P<username>\w{5,20})/count/
    """

    def get(self,request,username):

        #通过模型查询,获取用户名个数
        count = User.objects.filter(username=username).count()
        #组织数据
        context = {
            'count':count,
            'username':username
        }
        return Response(context)
class  Registerks(APIView):
    """
    获取留言

    """

    def get(self,request):

        #通过模型查询,获取用户名个数
        count = Message.objects.all()

        con = []
        for i in count:
            serializer = Registerds(i)
            con.append(serializer.data)



        return Response(con)



class  Registerkss(APIView):
    """
    获取留言数量

    """

    def get(self,request):

        #通过模型查询,获取用户名个数
        count = Message.objects.filter().count()



        return Response({'quantity':count})


class Registerapply_name(APIView):
    """
       请求申请发布博客的数据

       """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user

        # 通过模型查询,获取用户名个数


        # 组织数据
        count = Userz_apply.objects.all()

        context = []
        for i in count:

            context.append({'id':i.user_id,'name':i.user.name})

        return Response(context)


class  RegisterUsernameCount(APIView):
    """
    添加申请发布博客请求

    """

    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = self.request.user

        #通过模型查询,获取用户名个数

        count = Userz_apply()

        count.user_id = user.id
        count.save()
        #组织数据
        count = User.objects.filter(id=user.id)

        context = {
            'name':count[0].name,
            'id':user.id

        }
        return Response(context)

class  RegisterUsername(APIView):
    """
    判断是否申请了发布博客

    """

    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = self.request.user


        #组织数据
        count = Userz_apply.objects.filter(user_id=user.id).count()

        if count == 0:

            context = {
                'name': '申请发布博客',

            }
        else:
            context = {
                'name': '已申请',

            }
        return Response(context)



class RegisterPhoneCountAPIView(APIView):

    def get(self,request,mobile):


        count = User.objects.filter(mobile=mobile).count()
        #组织数据
        context = {
            'count':count,
            'phone':mobile
        }

        return Response(context)

class RegisterPhoneapply(APIView):
    """
    同意申请发布博客
    """
    def get(self,request,pk):
        count = User.objects.get(id=pk)
        count.bolg_sid = 1
        count.save()

        Userz_apply.objects.filter(user_id=pk).delete()


        #组织数据
        context = {
            'count':'同意成功'

        }

        return Response(context)

class RegisterPh(APIView):
    """
    不同意申请发布博客
    """
    def get(self,request,pk):
        # count = User.objects.get(id=pk)
        # count.bolg_sid = 1
        # count.save()

        Userz_apply.objects.filter(user_id=pk).delete()


        #组织数据
        context = {
            'count':'不同意'

        }

        return Response(context)


class RegisterPhone(APIView):
    def post(self, request):

            data = request.data
            print(data['mail'])
            print(data['Mobile'])

            # 3,判断,是否过了一分钟
            redis_conn = get_redis_connection("default")
            send_flag = redis_conn.get("send_flag_%s" % data['Mobile'])

            if send_flag:
                if send_flag.decode() == "1":
                    return Response({"message": "短信发送频繁"}, status=429)

            # 3,生成短信验证码
            sms_code = "%06d" % random.randint(0, 999999)
            print("sms_code=%s" % sms_code)

            # 4,保存到redis中
            redis_conn.setex("sms_%s" % data['Mobile'], 5 * 60, sms_code)
            # 参数1:key    参数:time     参数:value
            redis_conn.setex("send_flag_%s" % data['Mobile'], 60, 1)  # 存储标记,不让用户一分钟内多次发送


            from celery_tasks.email.tasks import send_verify_mail_url
            send_verify_mail_url.delay(data['mail'],sms_code)




            return Response({'code':0,'sms':sms_code})



# Create your views here.

class RegisterCreateView(CreateAPIView):
    """
    用户注册
    POST /users/

    用户注册我们需要对数据进行校验,同时需要数据入库
    """

    serializer_class = RegisterCreateSerializer




class MessageCreateView(CreateAPIView):
    """
    添加留言

    """
    serializer_class = Registerd


# Create your views here.

class RegisterCreate(CreateAPIView):
    """
    修改用户信息
    POST /users/

    用户注册我们需要对数据进行校验,同时需要数据入库
    """

    serializer_class = RegisterCreater



class UserDetailView(RetrieveAPIView):
    """
    获取登录用户的信息
    GET /users/
    既然是登录用户,我们就要用到权限管理
    在类视图对象中也保存了请求对象request
    request对象的user属性是通过认证检验之后的请求用户对象
    """
    permission_classes = [IsAuthenticated]

    serializer_class = UserDetailSerializer

    def get_object(self):
        return self.request.user


#修改密码


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]


#修改头像

from rest_framework.generics import UpdateAPIView
class Changeimg(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TUPIANSerializer

    def get_object(self):
        return self.request.user