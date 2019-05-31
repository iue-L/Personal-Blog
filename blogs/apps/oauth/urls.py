from django.conf.urls import url
from . import views
urlpatterns = [
    #1,获取qq登陆页面
    url(r'^qq/statues/$',views.QQAuthURLView.as_view()),

    #2,获取openid
    url(r'^qq/users/$',views.QQUserOpenIdView.as_view())
]