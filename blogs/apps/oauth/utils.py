from itsdangerous import TimedJSONWebSignatureSerializer as TJWSSerializer
from django.conf import settings

#1,对openid加密
def generate_save_user_openid(openid):
    #1,创建TJWSSerializer对象
    serializer = TJWSSerializer(settings.SECRET_KEY,expires_in=300)

    #2,加密数据
    token = serializer.dumps({"openid":openid})

    #3,返回
    return token

#2,对openid解密
def check_save_user_openid(access_token):
    #1,创建serializer对象
    serializer = TJWSSerializer(settings.SECRET_KEY,expires_in=300)

    #2,解密openid
    dict_data = serializer.loads(access_token)

    #3,返回
    return dict_data.get("openid")