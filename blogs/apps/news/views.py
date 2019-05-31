from django.shortcuts import render

# Create your views here.
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from news.models import Blog, Comments

from rest_framework.filters import OrderingFilter
# Create your views here.
from news.serializers import HotSkuListSerializer, OrderSettlementSerializer, OrderSettlement, RegisterCreateSerializer, \
    OrderSettlements, uploadCreateSerializer


#获取博客列表
class SkuListView(ListAPIView):
    serializer_class = HotSkuListSerializer


    def get_queryset(self):

        return Blog.objects.filter().order_by('watch')

    #1,指定排序方式
    filter_backends = [OrderingFilter]
    ordering_fields = ("watch") #前端调用方式ordering=指定的排序字段




class BlogDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 0,获取用户对象
        user = request.user

        data = Blog.objects.filter(user_id=user.id)
        print(data)
        # 3,创建序列化器,转换数据格式
        nale_list = []
        for i in data:
            nale_list.append({'title':i.title.replace('【','[').replace('】',']'),'id':i.id,'time':i.time})

        # serializer = OrderSettlementSerializer(data)

        return Response(nale_list)

#获得博客详情页数据
class BlogDeta(APIView):


    def get(self, request,pk):

        data = Blog.objects.get(id=pk)
        data.watch =int(data.watch) +1
        data.save()


        return Response('ok')

#获得博客详情页评论

class BlogDetas(ListAPIView):
    serializer_class = OrderSettlements


    def get_queryset(self):

        return Comments.objects.filter(news=self.kwargs['pk'])

    #1,指定排序方式
    filter_backends = [OrderingFilter]
    ordering_fields = ("time") #前端调用方式ordering=指定的排序字段





class RegisterCreateView(CreateAPIView):
    """
    添加评论
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RegisterCreateSerializer




class Registerupload(CreateAPIView):
    """
    添加博客
    """

    serializer_class = uploadCreateSerializer