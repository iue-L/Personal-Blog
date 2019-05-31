from QQLoginTool.QQtool import OAuthQQ
from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import GenericAPIView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from blogs import settings
from oauth import serializers
from oauth.models import OAuthQQUser
from oauth.serializers import QQUserSerializer
from oauth.utils import generate_save_user_openid


class QQAuthURLView(APIView):
    """
    提供QQ登录页面网址

    """
    def get(self, request):

        # next表示从哪个页面进入到的登录页面，将来登录成功后，就自动回到那个页面
        # state= request.query_params.get('state')

        state= '/gg/user.html'

        # 获取QQ登录页面网址
        oauth = OAuthQQ(client_id=settings.QQ_CLIENT_ID, client_secret=settings.QQ_CLIENT_SECRET, redirect_uri=settings.QQ_REDIRECT_URI, state=state)
        login_url = oauth.get_qq_url()

        return Response({'login_url':login_url})


class QQUserOpenIdView(GenericAPIView):

    serializer_class = QQUserSerializer

    def get(self,request):
        #1,获取参数code,判断是否存在
        code = request.query_params.get("code")

        if not code:
            return Response({"message":"code丢失"},status=status.HTTP_400_BAD_REQUEST)

        #2,创建oath对象,通过code获取,access_token
        auth = OAuthQQ(client_id=settings.QQ_CLIENT_ID,client_secret=settings.QQ_CLIENT_SECRET,redirect_uri=settings.QQ_REDIRECT_URI,state="/")
        try:
            access_token = auth.get_access_token(code)

            #3,通过access_token获取openid
            openid = auth.get_open_id(access_token)

            #4,通过openid查询oauthqq对象
            try:
                oauth_qq_user = OAuthQQUser.objects.get(openid=openid)
            except Exception:
                #①, 没有没有美多用户, 也没有OAuthQQUser用户
                #②, 有美多用户, 没有OAuthQQUser用户

                #5,qq用户没有和美多用户绑定过,加密openid,并返回
                access_token_openid = generate_save_user_openid(openid)
                return Response({"access_token":access_token_openid})

        except Exception:
            return Response({"message":"请求qq服务器异常"},status=status.HTTP_400_BAD_REQUEST)

        #6,oauth_qq_user存在,并且绑定过了美多用户
        user = oauth_qq_user.user

        #7,组织数据,拼接token,返回响应
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        response = Response({
            "user_id":user.id,
            "username":user.username,
            "token":token
        })


        return response

    def post(self,request):
        #1,获取数据
        dict_data = request.data

        #2,获取序列化器,校验数据
        serializer = self.get_serializer(data=dict_data)
        serializer.is_valid(raise_exception=True)

        #3,数据入库
        oauth_qq = serializer.save()

        #4,组织,数据返回响应
        user = oauth_qq.user
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        response = Response({
            "user_id":user.id,
            "username":user.username,
            "token":token
        })



        return response