from django.conf.urls import url
from . import views
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    #/users/usernames/(?P<username>\w{5,20})/count/

    url(r'^usernames/(?P<username>\w{5,20})/count/$',views.RegisterUsernameCountAPIView.as_view(),name='usernamecount'),
    url(r'^apply/$',views.RegisterUsernameCount.as_view(),name='apply'),
    url(r'^apply_name/$',views.Registerapply_name.as_view(),name='apply_name'),
    url(r'^applys/$',views.RegisterUsername.as_view(),name='apply'),
    # url(r'^usernames/(?P<id>\w{1,20})/blog/$',views.RegisterUsername.as_view(),name='idcount'),
    url(r'^phones/(?P<mobile>1[345789]\d{9})/count/$', views.RegisterPhoneCountAPIView.as_view(), name='phonecount'),
    url(r'^smscodes/$', views.RegisterPhone.as_view(), name='sms_codes'),
    url(r'^auths/', obtain_jwt_token, name='auths'),
    url(r'^user_data/',views.UserDetailView.as_view(), name='data'),
    url(r'^user/(?P<pk>\d+)/password/$', views.ChangePasswordView.as_view()),
    url(r'^Agreed/(?P<pk>\d+)/$', views.RegisterPhoneapply.as_view()),
    url(r'^Agreeds/(?P<pk>\d+)/$', views.RegisterPh.as_view()),
    url(r'^user/', views.RegisterCreateView.as_view(), name='rew'),
    url(r'^gbook/', views.MessageCreateView.as_view(), name='Message'),
    url(r'^gbooks/', views.Registerks.as_view(), name='gooks'),
    url(r'^quantity/', views.Registerkss.as_view(), name='gooks'),
    url(r'^users_data/', views.RegisterCreate.as_view(), name='users'),
    url(r'^users_img/', views.Changeimg.as_view(), name='img'),

]