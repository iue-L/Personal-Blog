from django.conf.urls import url
from . import views
urlpatterns = [
    url(r'^categories/blog/$', views.SkuListView.as_view(), name='list'),
    url(r'^blog/(?P<pk>\d+)/$', views.BlogDeta.as_view(), name='blog_list'),
    url(r'^comments/(?P<pk>\d+)/$', views.BlogDetas.as_view(), name='blog_list'),
    url(r'^blog_name/$', views.BlogDetailView.as_view(), name='list_name'),
    url(r'^comments/$', views.RegisterCreateView.as_view(), name='comments'),
    url(r'^upload/$', views.Registerupload.as_view(), name='upload'),

]